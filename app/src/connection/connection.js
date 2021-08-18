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
import stunServers from './stunServers';
import { parseIceUfrag } from '../utils';

const main = () => {
  const socket = io(process.env.REACT_APP_SIGNALING_SERVER);

  socket.on('connect', () => console.log('signaling server socket connected'));
  socket.on('disconnect', () =>
    console.log('signaling server socket disconnected'),
  );

  let pc;
  let channel;
  let relaySocket;

  const handleFailed = () => {
    console.log('failed, attempting relay connection');
    console.log('ice failed');
    relaySocket = io(process.env.REACT_APP_RELAY_SERVER);
    relaySocket.on('relayState', (state) => {
      console.log('relay state:', state);
      if (state === 'ready') {
        console.log('relay connection ready');
      }
    });
    relaySocket.on('relay', (arg) => {
      console.log('received relayed data:', arg);
    });
    relaySocket.on('connect', () => {
      console.log('relay server socket connected');
      relaySocket.emit('peerIds', {
        localId: parseIceUfrag(pc.localDescription.sdp),
        remoteId: parseIceUfrag(pc.remoteDescription.sdp),
      });
    });
    relaySocket.on('disconnect', () =>
      console.log('signaling server socket disconnected'),
    );
  };

  function start() {
    pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: (() => {
            const fourServers = [];
            for (let i = 0; i < 20; i += 1) {
              fourServers.push(
                `stun:${
                  stunServers()[
                    Math.floor(Math.random() * stunServers().length)
                  ]
                }`,
              );
            }
            return fourServers;
          })(),
        },
      ],
    });

    console.log(pc.connectionState);
    pc.onconnectionstatechange = () => {
      console.log(pc.connectionState);
      if (pc.connectionState === 'failed') {
        handleFailed();
      }
      console.log(pc.connectionState);
    };

    pc.onicecandidate = ({ candidate }) => {
      socket.emit('signaling', { candidate });
    };

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription();
        socket.emit('signaling', { description: pc.localDescription });
      } catch (err) {
        console.error(err);
      }
    };

    channel = pc.createDataChannel('chat', { negotiated: true, id: 0 });
    channel.onopen = () => {
      console.log('dataChannel open');
    };
    channel.onmessage = ({ data }) => {
      console.log('received dataChannel data:', data);
    };
  }

  socket.on('signaling', async ({ description, candidate }) => {
    if (!pc) start();

    try {
      if (description) {
        await pc.setRemoteDescription(description);
        if (description.type == 'offer') { // eslint-disable-line
          await pc.setLocalDescription();
          socket.emit('signaling', { description: pc.localDescription });
        }
      } else if (candidate) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error(err);
    }
  });
};

export default main;

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
