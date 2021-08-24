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
  setIds,
  setId,
  setChatMessages,
  setMain,
  setChannels,
  setRelay,
  setRemotes,
}) => {
  socket.on('connect', () => console.log('signaling socket connected'));
  socket.on('disconnect', () => console.log('signaling socket disconnected'));

  const handleFailed = (remoteId) => {
    console.log('using relay connection');
    let main = false;
    setMain((x) => {
      main = x;
      return x;
    });
    setRelay((x) => {
      if (!x) {
        const relaySocket = io(process.env.REACT_APP_RELAY_SERVER);
        relaySocket.on('connect', () => {
          console.log('relay socket connected');
        });
        relaySocket.on('disconnect', () => {
          console.log('relay socket disconnected');
        });
        relaySocket.on('data', (data) =>
          receiveData(remoteId, data, setChatMessages, objects, objectIds),
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
    console.log('start connection to remoteId', remoteId);
    const pc = new RTCPeerConnection({ iceServers });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        console.log('peer connection failed');
        handleFailed(remoteId);
        console.log('id push:', remoteId);
        objectIds.current.push(remoteId);
        setIds(objectIds.current);
      } else if (pc.connectionState === 'connected') {
        console.log('peer connection ready');
        objectIds.current.push(remoteId);
        setIds(objectIds.current);
      }
    };

    pc.onicecandidate = ({ candidate }) => {
      socket.emit('signaling', { remoteId, candidate });
    };

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription();
        console.log('signaling');
        socket.emit('signaling', {
          remoteId,
          description: pc.localDescription,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const channelUnordered = pc.createDataChannel('unorderedChannel', {
      // ordered: false,
      negotiated: true,
      id: 0,
    });

    const channelOrdered = pc.createDataChannel('orderedChannel', {
      negotiated: true,
      id: 1,
    });

    console.log('unordered channel:', channelUnordered.readyState);
    console.log('ordered channel:', channelOrdered.readyState);

    channelUnordered.onclose = () => {
      setChannels((x) => ({
        ordered: x.ordered,
        unordered: x.unordered.filter((xx) => xx !== channelUnordered),
      }));
      console.log('unordered channel closed');
    };

    channelUnordered.onopen = () => {
      setChannels((x) => ({
        ordered: x.ordered,
        unordered: [...x.unordered, channelUnordered],
      }));
      console.log('unordered channel open');
    };

    channelUnordered.onmessage = ({ data }) => {
      console.log('unordered channel data', data);
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
      console.log('ordered channel closed');
    };

    channelOrdered.onopen = () => {
      setChannels((x) => ({
        ordered: [...x.ordered, channelOrdered],
        unordered: x.unordered,
      }));
      console.log('ordered channel open');
    };

    channelOrdered.onmessage = ({ data }) => {
      console.log('ordered channel data', data);
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
    delete objects.current[remoteId]; // eslint-disable-line no-param-reassign
    const index = objectIds.current.indexOf((x) => x === remoteId);
    if (index !== -1) objectIds.current.splice(index, 1);
    setIds(objectIds.current);
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
    setIds(objectIds.current);
    console.log('own id:', clientId);
  });

  socket.on('signaling', async ({ id: remoteId, description, candidate }) => {
    console.log('signaling received');
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
        console.log('description:', description);
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

/*
    sendButton.onclick = () => {
      const data = dataChannelSend.value;
      if (pc.connectionState === 'failed' && relaySocket) {
        relaySocket.emit('relay', data);
      } else {
        channel.send(data);
      }
      console.log(`Sent Data: ${data}`);
    };
    */

/*
  closeButton.onclick = () => {
    if (pc) {
      pc.close();
      connectionStateText.innerHTML = 'disconnected';
    }
    if (relaySocket) {
      relaySocket.disconnect();
      connectionStateText.innerHTML = 'disconnected';
    }
  };
  */

/*
  startButton.onclick = () => {
    start();
  };
  */
