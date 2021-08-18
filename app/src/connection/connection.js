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
import iceServers from './iceServers';

const connect = () => {
  const socket = io(process.env.REACT_APP_SIGNALING_SERVER);

  socket.on('connect', () => console.log('signaling socket connected'));
  socket.on('disconnect', () => console.log('signaling socket disconnected'));

  let id;
  let pc;
  let channel;
  let relaySocket;

  const handleFailed = (remoteId) => {
    relaySocket = io(process.env.REACT_APP_RELAY_SERVER);
    relaySocket.on('relay', (arg) => {
      console.log('received relayed data:', arg);
    });
    relaySocket.on('connect', () => {
      console.log('relay socket connected');
      relaySocket.emit('peerIds', {
        localId: id,
        remoteId,
      });
    });
  };

  function start(remoteId) {
    pc = new RTCPeerConnection({ iceServers });

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
        socket.emit('signaling', {
          remoteId,
          description: pc.localDescription,
        });
      } catch (err) {
        console.error(err);
      }
    };

    channel = pc.createDataChannel('dataChannel', { negotiated: true, id: 0 });
    channel.onopen = () => {
      console.log('dataChannel open');
    };
    channel.onmessage = ({ data }) => {
      console.log('received dataChannel data:', data);
    };
  }

  socket.on('init', (arg) => {
    id = arg;
    if (id !== 'main') {
      start('main');
    }
  });

  socket.on('signaling', async ({ id: remoteId, description, candidate }) => {
    if (!pc) start(remoteId);

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
  return { id, channel, relaySocket };
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
