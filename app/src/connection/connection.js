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

const connect = ({ setId, setRemotes }) => {
  const socket = io(process.env.REACT_APP_SIGNALING_SERVER);

  socket.on('connect', () => console.log('signaling socket connected'));
  socket.on('disconnect', () => console.log('signaling socket disconnected'));

  let main;
  const remotes = {};
  let relaySocket;

  const handleFailed = (remoteId) => {
    console.log('using relay connection');
    if (!relaySocket) {
      relaySocket = io(process.env.REACT_APP_RELAY_SERVER);
      relaySocket.emit('main', main);
    }
    relaySocket.on('connect', () => {
      console.log('relay socket connected');
    });
    remotes[remoteId].relaySocket = relaySocket;
    setRemotes(remotes);
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
      negotiated: true,
      id: 0,
    });

    console.log('channel:', channel.readyState);

    channel.onopen = () => {
      console.log('dataChannel open');
    };

    channel.onmessage = ({ data }) => {
      console.log('received dataChannel data:', data);
    };

    remotes[remoteId] = { pc, channel };
    setRemotes(remotes);
  };

  socket.on('peerDisconnect', (remoteId) => {
    if (remotes[remoteId]) remotes[remoteId].pc.close();
    delete remotes[remoteId];
    if (relaySocket && !Object.keys(remotes).find((x) => x.relaySocket)) {
      relaySocket.disconnect();
      relaySocket = undefined;
    }
    setRemotes(remotes);
  });

  socket.on('connectToMain', (remoteId) => {
    console.log('start connect to main', remoteId);
    start(remoteId);
  });

  socket.on('main', () => {
    main = true;
    if (relaySocket) relaySocket.emit('main', main);
    console.log('you are main');
  });

  socket.on('init', (id) => {
    setId(id);
  });

  socket.on('signaling', async ({ id: remoteId, description, candidate }) => {
    console.log('signaling received');
    if (!remotes[remoteId]) start(remoteId);
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
