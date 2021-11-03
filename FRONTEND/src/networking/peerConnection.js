import adapter from 'webrtc-adapter';
import { io } from 'socket.io-client';
import iceServers from './iceServers';
import { receiveData } from './services/game.service';
import setupRelayConnection from './relay';
import { saveGameState, getGameObject } from './services/gameObject.service';

const connect = ({
  objects,
  objectIds,
  user,
  setConnectionMessage,
  setIds,
  setId,
  setChatMessages,
  setMain,
}) => {
  let ownId;
  let main;
  let remotes = {};
  const channels = { ordered: [], unordered: [] };
  let relay;
  let signaler;

  const getChannels = () => channels;
  const getRelay = () => relay;
  const setRelay = (x) => {
    relay = x;
  };
  const getSignaler = () => signaler;

  const disconnect = () => {
    Object.keys(remotes).forEach((x) => {
      if (remotes[x].pc) remotes[x].pc.close();
    });
    if (relay) relay.disconnect();
    if (signaler) signaler.disconnect();
    remotes = {};
    relay = undefined;
    signaler = undefined;
  };

  const mainHandleNewId = async (newId) => {
    if (main && main === ownId) {
      if (!objectIds.current.includes(newId)) {
        // here fetch object info from database and create object
        let obj = { username: newId, score: 0 };
        let err = null;
        if (!newId.includes('guest_')) {
          const { data, error } = await getGameObject(newId);
          obj = data;
          err = error;
        }
        if (!err && typeof obj.score === 'number') {
          objectIds.current.push(newId);
          const obsCur = objects.current;
          obsCur[newId] = {
            username: obj.username,
            score: obj.score,
            startPosition: [0, 0, 1],
            startQuaternion: [0, 0, 0, 1],
            controls: { up: 0, down: 0, left: 0, right: 0 },
            controlsOverChannels: { up: 0, down: 0, left: 0, right: 0 },
            controlsOverRelay: { up: 0, down: 0, left: 0, right: 0 },
            speed: 0.3,
            rotationSpeed: 1,
            backendPosition: { x: 0, y: 0, z: 1 },
            backendQuaternion: [0, 0, 0, 1],
            keyDowns: [],
          };
          setIds((x) => {
            if (!x.includes(newId)) {
              return [...x, newId];
            }
            return x;
          });
        } else {
          const errorText = `Failed to create game object ${newId}. Error: ${
            err || 'Game object property "score" is not a number'
          }.`;
          console.error(errorText);
        }
      }
    }
  };

  const handleDeleteId = (delId) => {
    const objs = objects.current;
    delete objs[delId];
    const index = objectIds.current.indexOf(delId);
    if (index !== -1) objectIds.current.splice(index, 1);
    setIds((x) => x.filter((xx) => xx !== delId));
  };

  signaler = io(
    process.env.NODE_ENV === 'production'
      ? `wss://${process.env.REACT_APP_BACKEND}`
      : `ws://${process.env.REACT_APP_BACKEND}`,
    {
      auth: {
        token: user ? user.token : null,
      },
    },
  );

  signaler.on('connect_error', (err) => {
    console.error(err);
  });

  signaler.on('connect', () => {
    setConnectionMessage('signaling socket connected');
    console.log('signaling socket connected');
  });
  signaler.on('disconnect', () => {
    setConnectionMessage('signaling socket disconnected');
    console.log('signaling socket disconnected');
  });

  const handleFailed = (remoteId) => {
    setConnectionMessage(`peer ${remoteId}, using relay connection`);
    console.log('peer', remoteId, 'using relay connection');
    setupRelayConnection({
      mainHandleNewId,
      setRelay,
      getRelay,
      setIds,
      ownId,
      main,
      setConnectionMessage,
      setChatMessages,
      objectIds,
      objects,
      setMain,
      remoteId,
    });
    remotes[remoteId] = { ...remotes[remoteId], relaySocket: true };
  };

  const start = (remoteId) => {
    setConnectionMessage(`connecting with peer ${remoteId}`);
    console.log('peer', remoteId, 'connecting');
    const pc = new RTCPeerConnection({ iceServers });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        setConnectionMessage(`peer ${remoteId}, connection failed`);
        console.log('peer', remoteId, 'peer connection failed');
        handleFailed(remoteId);
      } else if (pc.connectionState === 'connected') {
        setConnectionMessage(`peer ${remoteId}, connection ready`);
        console.log('peer', remoteId, 'peer connection ready');
        mainHandleNewId(remoteId);
      } else if (pc.connectionState === 'closed') {
        setConnectionMessage(`peer ${remoteId}, connection closed`);
        console.log('peer', remoteId, 'peer connection closed');
      }
    };

    pc.onicecandidate = ({ candidate }) => {
      getSignaler().emit('signaling', { remoteId, candidate });
    };

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription();
        getSignaler().emit('signaling', {
          remoteId,
          description: pc.localDescription,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const channelUnordered = pc.createDataChannel('unorderedChannel', {
      ordered: false,
      negotiated: true,
      id: 0,
    });

    const channelOrdered = pc.createDataChannel('orderedChannel', {
      negotiated: true,
      id: 1,
    });

    channelUnordered.onclose = () => {
      getChannels().unordered = getChannels().unordered.filter(
        (xx) => xx !== channelUnordered,
      );
    };

    channelUnordered.onopen = () => {
      getChannels().unordered.push(channelUnordered);
    };

    channelUnordered.onmessage = ({ data }) => {
      receiveData(
        remoteId,
        JSON.parse(data),
        setChatMessages,
        objectIds,
        objects,
        setIds,
        ownId,
        { getRelay, getChannels },
        setMain,
      );
    };

    channelOrdered.onclose = () => {
      getChannels().ordered = getChannels().ordered.filter(
        (xx) => xx !== channelOrdered,
      );
    };

    channelOrdered.onopen = () => {
      getChannels().ordered.push(channelOrdered);
      if (main === ownId) {
        setIds((x) => [...x]); // trigger mainUpdatePeers
      }
    };

    channelOrdered.onmessage = ({ data }) => {
      receiveData(
        remoteId,
        JSON.parse(data),
        setChatMessages,
        objectIds,
        objects,
        setIds,
        ownId,
        { getRelay, getChannels },
        setMain,
      );
    };
    remotes[remoteId] = { pc, channelUnordered, channelOrdered };
  };

  signaler.on('nomain', () => {
    setConnectionMessage(
      'game host disconnected, no other available hosts found, please try again later',
    );
  });

  signaler.on('peerDisconnect', (remoteId) => {
    setConnectionMessage(`peer ${remoteId} disconnect`);
    console.log('peer', remoteId, 'disconnect');
    if (main && main === ownId) {
      saveGameState(
        objectIds.current.reduce((acc, cur) => {
          if (!cur.includes('guest_')) {
            acc.push({
              playerId: cur,
              score: objects.current[cur].score,
            });
          }
          return acc;
        }, []),
      );
    }
    handleDeleteId(remoteId);
    if (remotes[remoteId]) remotes[remoteId].pc.close();
    delete remotes[remoteId];
    if (relay && !Object.keys(remotes).find((xx) => xx.relaySocket)) {
      relay.disconnect();
      relay = undefined;
    }
  });

  signaler.on('connectToMain', (remoteId) => {
    setMain(remoteId);
    start(remoteId);
  });

  signaler.on('main', (arg) => {
    main = arg;
    setMain(arg);
    if (relay) relay.emit('main', true);
    mainHandleNewId(main);
    console.log('you are main');
  });

  signaler.on('fail', (reason) => {
    console.log('signaling socket fail, reason:', reason);
  });

  signaler.on('init', (clientId) => {
    ownId = clientId;
    setId(clientId);
    console.log('own id:', clientId);
  });

  signaler.on('signaling', async ({ id: remoteId, description, candidate }) => {
    if (!remotes[remoteId]) {
      start(remoteId);
    }
    const { pc } = remotes[remoteId];
    try {
      if (description) {
        await pc.setRemoteDescription(description);
        if (description.type === 'offer') {
          await pc.setLocalDescription();
          signaler.emit('signaling', {
            remoteId,
            description: pc.localDescription,
          });
        }
      } else if (candidate) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error(err);
    }
  });
  return { disconnect, getRelay, setRelay, getSignaler, getChannels };
};

export default connect;
