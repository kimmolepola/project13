/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-disable no-use-before-define, no-multi-assign */

import adapter from 'webrtc-adapter'; // eslint-disable-line import/no-unresolved
import { io } from 'socket.io-client';
import socket from '../services/signalingSocket';
import iceServers from './iceServers';
import { receiveData } from '../messageHandler';

const connect = ({
  objects,
  objectIds,
  setConnectionMessage,
  setIds,
  setId,
  setChatMessages,
  setMain,
  setChannels,
  setRelay,
  setRemotes,
}) => {
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
    let main = false;
    setMain((x) => {
      main = x;
      return x;
    });
    setRelay((x) => {
      if (!x) {
        const relaySocket = io(process.env.REACT_APP_RELAY_SERVER);
        relaySocket.on('connect', () => {
          setConnectionMessage('relay socket connected');
          console.log('relay socket connected');
        });
        relaySocket.on('disconnect', () => {
          setConnectionMessage('relay socket disconnected');
          console.log('relay socket disconnected');
        });
        relaySocket.on('data', (data) =>
          receiveData(remoteId, data, setChatMessages, objectIds, objects),
        );
        relaySocket.emit('main', main);
        return relaySocket;
      }
      return x;
    });
    setRemotes((x) => ({
      ...x,
      [remoteId]: { ...x[remoteId], relaySocket: true },
    }));
  };

  const start = (remoteId) => {
    setConnectionMessage(`peer ${remoteId}, start connecting`);
    console.log('peer', remoteId, 'start connection to remoteId');
    const pc = new RTCPeerConnection({ iceServers });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        setConnectionMessage(`peer ${remoteId}, connection failed`);
        console.log('peer', remoteId, 'peer connection failed');
        handleFailed(remoteId);
        objectIds.current.push(remoteId);
        setIds((x) => [...x, remoteId]);
      } else if (pc.connectionState === 'connected') {
        setConnectionMessage(`peer ${remoteId}, connection ready`);
        console.log('peer', remoteId, 'peer connection ready');
        objectIds.current.push(remoteId);
        setIds((x) => [...x, remoteId]);
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
    delete objects.current[remoteId]; // eslint-disable-line no-param-reassign
    const index = objectIds.current.indexOf(remoteId);
    if (index !== -1) objectIds.current.splice(index, 1);
    setIds((x) => x.filter((xx) => xx !== remoteId));
    let newRemotes;
    setRemotes((x) => {
      if (x[remoteId]) x[remoteId].pc.close();
      newRemotes = { ...x };
      delete newRemotes[remoteId];
      return newRemotes;
    });
    setRelay((x) => {
      if (x && !Object.keys(newRemotes).find((xx) => xx.relaySocket)) {
        x.disconnect();
        return undefined;
      }
      return x;
    });
  });

  socket.on('connectToMain', (remoteId) => {
    start(remoteId);
  });

  socket.on('main', () => {
    setMain(true);
    setRelay((x) => {
      if (x) x.emit('main', true);
      return x;
    });
    console.log('you are main');
  });

  socket.on('init', (clientId) => {
    setId(clientId);
    objectIds.current.push(clientId);
    setIds((x) => [...x, clientId]);
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
  return socket;
};

export default connect;
