/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-disable no-use-before-define, no-multi-assign */

import adapter from 'webrtc-adapter'; // eslint-disable-line import/no-unresolved
import { signaling as socket, relay as relaySocket } from '../services/sockets';
import iceServers from './iceServers';
import { receiveData, receiveMessage } from '../networkMessages';

const connect = ({
  objects,
  objectIds,
  id,
  setMessages,
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
        relaySocket.on('data', (data) =>
          receiveData(data, objects, objectIds, id),
        );
        relaySocket.on('message', (data) => receiveMessage(data, setMessages));
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
    const pc = new RTCPeerConnection({ iceServers });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        console.log('ice failed');
        handleFailed(remoteId);
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

    const channel = pc.createDataChannel('dataChannel', {
      ordered: false,
      negotiated: true,
      id: 0,
    });

    const channel2 = pc.createDataChannel('messageChannel', {
      negotiated: true,
      id: 1,
    });

    console.log('channel:', channel.readyState);
    console.log('channel2:', channel2.readyState);

    channel.onclose = () => {
      setChannels((x) => ({
        message: x.message,
        data: x.data.filter((xx) => xx !== channel),
      }));
      console.log('dataChannel closed');
    };

    channel.onopen = () => {
      setChannels((x) => ({
        message: x.message,
        data: [...x.data, channel],
      }));
      console.log('dataChannel open');
    };

    channel.onmessage = ({ data }) => {
      console.log('data', data);
      receiveData(JSON.parse(data), objects, objectIds, id);
    };

    channel2.onclose = () => {
      setChannels((x) => ({
        message: x.message.filter((xx) => xx !== channel),
        data: x.data,
      }));
      console.log('messageChannel closed');
    };

    channel2.onopen = () => {
      setChannels((x) => ({
        message: [...x.message, channel],
        data: x.data,
      }));
      console.log('messageChannel open');
    };

    channel2.onmessage = ({ data }) => {
      console.log('message', data);
      receiveMessage(JSON.parse(data), setMessages);
    };

    let newRemotes;
    setRemotes((x) => {
      newRemotes = { ...x, [remoteId]: { pc, channel, channel2 } };
      return newRemotes;
    });
    return newRemotes;
  };

  socket.on('peerDisconnect', (remoteId) => {
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
    console.log('start connect to main', remoteId);
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
    id.current = clientId; // eslint-disable-line no-param-reassign
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
