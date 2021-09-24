import adapter from 'webrtc-adapter';
import { io } from 'socket.io-client';
import iceServers from './iceServers';
import { receiveData } from './services/game.service';
import setupRelayConnection from './relay';

const connect = ({
  objects,
  objectIds,
  user,
  setConnectionMessage,
  setIds,
  setId,
  setChatMessages,
  setMain,
  setChannels,
  setSignaler,
  setRelay,
  setRemotes,
}) => {
  let ownId;
  let main;

  const handleDeleteId = (delId) => {
    const objs = objects.current;
    delete objs[delId];
    const index = objectIds.current.indexOf(delId);
    if (index !== -1) objectIds.current.splice(index, 1);
    setIds((x) => x.filter((xx) => xx !== delId));
  };

  const mainHandleNewId = (newId) => {
    if (main && main === ownId) {
      if (!objectIds.current.includes(newId)) {
        objectIds.current.push(newId);
        const obsCur = objects.current;
        // here fetch object info from database and create object
        obsCur[newId] = {
          score: 0,
          startPosition: [0, 0, 1],
          startQuaternion: [0, 0, 0, 1],
          controls: { left: 0, right: 0 },
          controlsOverChannels: { left: 0, right: 0 },
          controlsOverRelay: { left: 0, right: 0 },
          speed: 0.3,
          rotationSpeed: 1,
          backendPosition: { x: 0, y: 0, z: 1 },
          backendQuaternion: [0, 0, 0, 1],
          keyDowns: [],
        };
      }
      setIds((x) => {
        if (!x.includes(newId)) {
          return [...x, newId];
        }
        return x;
      });
    }
  };

  const socket = io(process.env.REACT_APP_SIGNALING_SERVER, {
    auth: {
      token: user ? user.token : null,
    },
  });
  setSignaler(socket);

  socket.on('connect_error', (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });

  socket.on('connect', () => {
    setConnectionMessage('signaling socket connected');
    console.log('signaling socket connected');
  });
  socket.on('disconnect', () => {
    setConnectionMessage('signaling socket disconnected');
    console.log('signaling socket disconnected');
  });

  const handleFailed = (remoteId) => {
    setConnectionMessage(`peer ${remoteId}, using relay connection`);
    console.log('peer', remoteId, 'using relay connection');
    setupRelayConnection({
      setRelay,
      setIds,
      ownId,
      main,
      setConnectionMessage,
      setChatMessages,
      objectIds,
      objects,
      setChannels,
      setMain,
      setRemotes,
      remoteId,
    });
  };

  const start = (remoteId) => {
    setConnectionMessage(`peer ${remoteId}, starting connection`);
    console.log('peer', remoteId, 'starting connection');
    const pc = new RTCPeerConnection({ iceServers });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        setConnectionMessage(`peer ${remoteId}, connection failed`);
        console.log('peer', remoteId, 'peer connection failed');
        handleFailed(remoteId);
        mainHandleNewId(remoteId);
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
      socket.emit('signaling', { remoteId, candidate });
    };

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription();
        socket.emit('signaling', {
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
      setChannels((x) => ({
        ordered: x.ordered,
        unordered: x.unordered.filter((xx) => xx !== channelUnordered),
      }));
    };

    channelUnordered.onopen = () => {
      setChannels((x) => ({
        ordered: x.ordered,
        unordered: [...x.unordered, channelUnordered],
      }));
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
        setChannels,
        setRelay,
        setMain,
      );
    };

    channelOrdered.onclose = () => {
      setChannels((x) => ({
        ordered: x.ordered.filter((xx) => xx !== channelOrdered),
        unordered: x.unordered,
      }));
    };

    channelOrdered.onopen = () => {
      setChannels((x) => ({
        ordered: [...x.ordered, channelOrdered],
        unordered: x.unordered,
      }));
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
        setChannels,
        setRelay,
        setMain,
      );
    };

    let newRemotes;
    setRemotes((x) => {
      newRemotes = {
        ...x,
        [remoteId]: { pc, channelUnordered, channelOrdered },
      };
      return newRemotes;
    });
    return newRemotes;
  };

  socket.on('peerDisconnect', (remoteId) => {
    setConnectionMessage(`peer ${remoteId} disconnect`);
    console.log('peer', remoteId, 'disconnect');
    handleDeleteId(remoteId);
    let remotes;
    setRemotes((x) => {
      remotes = x;
      return x;
    });
    if (remotes[remoteId]) remotes[remoteId].pc.close();
    const newRemotes = { ...remotes };
    delete newRemotes[remoteId];
    setRemotes(newRemotes);
    let relay;
    setRelay((x) => {
      relay = x;
      return x;
    });
    if (relay && !Object.keys(newRemotes).find((xx) => xx.relaySocket)) {
      relay.disconnect();
      setRelay(undefined);
    }
  });

  socket.on('connectToMain', (remoteId) => {
    setMain(remoteId);
    start(remoteId);
  });

  socket.on('main', (arg) => {
    main = arg;
    setMain(arg);
    let relay;
    setRelay((x) => {
      relay = x;
      return x;
    });
    if (relay) relay.emit('main', true);
    mainHandleNewId(main);
    console.log('you are main');
  });

  socket.on('init', (clientId) => {
    ownId = clientId;
    setId(clientId);
    console.log('own id:', clientId);
  });

  socket.on('signaling', async ({ id: remoteId, description, candidate }) => {
    let remotes;
    setRemotes((x) => {
      remotes = x;
      return x;
    });
    if (!remotes[remoteId]) {
      remotes = start(remoteId);
    }
    const { pc } = remotes[remoteId];
    try {
      if (description) {
        await pc.setRemoteDescription(description);
        if (description.type === 'offer') {
          await pc.setLocalDescription();
          socket.emit('signaling', {
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
};

export default connect;