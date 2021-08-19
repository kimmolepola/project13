const setupNetworkEvents = ({ id, remotes, objectIds, objects }) => {
  const rtcConnections = [];

  const receiveMessage = ({ data }) => {
    console.log('received message:', data);
  };

  let relay;
  Object.keys(remotes).forEach((x) => {
    if (remotes[x].channel.readyState === 'open') {
      rtcConnections.push(x);
      // eslint-disable-next-line no-param-reassign
      remotes[x].channel.onmessage = receiveMessage;
    } else if (remotes[x].relaySocket) {
      console.log('relay1:', relay);
      if (!relay) {
        remotes[x].relaySocket.on('message', receiveMessage);
        relay = remotes[x].relaySocket;
        console.log('relay2:', relay);
      }
    }
  });

  const removeListeners = () => {
    if (relay) relay.off('message', receiveMessage);
  };

  const sendMessage = (message) => {
    console.log(
      'sending message',
      message,
      'rtc length',
      rtcConnections.length,
      'relay',
      relay,
    );
    rtcConnections.forEach((x) => remotes[x].channel.send(message));
    if (relay) relay.emit('message', message);
  };

  return { sendMessage, removeListeners };
};

export default setupNetworkEvents;

/*
const subscribeToSocketEventsForGame = ({
  channel,
  socket,
  objects,
  objectIds,
  id,
}) => {
  const createObject = (arg) => {
    objectIds.current.push(arg);
  };
  const deleteObject = (arg) => {
    objectIds.current.filter((x) => x !== arg);
    delete objects.current[arg]; // eslint-disable-line no-param-reassign
  };
  const update = (arg) => {
    for (let i = objectIds.length - 1; i > -1; i -= 1) {
      const objectLocal = objects.current[objectIds[i]];
      const objectBackend = arg[objectIds[i]];
      if (objectLocal && objectBackend) {
        if (objectIds[i] !== id) {
          objectLocal.keyDowns = objectBackend.keyDowns;
        }
        objectLocal.rotationSpeed = objectBackend.rotationSpeed;
        objectLocal.speed = objectBackend.speed;
        objectLocal.backendPosition = objectBackend.position;
        objectLocal.backendQuaternion = objectBackend.quaternion;
      }
    }
  };
  const allObjects = (arg) => {
    objectIds.current = arg; // eslint-disable-line no-param-reassign
  };

  socket.on('create', createObject);
  socket.on('delete', deleteObject);
  socket.on('update', update);
  socket.on('allObjects', allObjects);
  return () => {
    socket.off('create', createObject);
    socket.off('delete', deleteObject);
    socket.off('update', update);
    socket.off('allObjects', allObjects);
  };
};

export default subscribeToSocketEventsForGame;

import { chatMessageTimeToLiveSeconds } from '../parameters';

export const sendChatComment = ({ channel, socket, message }) => {
  socket.emit('chatMessage', message);
};

const subscribeToSocketEventsForUI = ({ socket, setMessages }) => {
  const receiveChatMessage = (arg) => {
    setMessages((x) => [arg, ...x]);
    setTimeout(
      () => setMessages((x) => x.filter((xx) => xx !== arg)),
      chatMessageTimeToLiveSeconds * 1000,
    );
  };

  channel.onmessage
  socket.on('chatMessage', receiveChatMessage);
  return () => {
    socket.off('chatMessage', receiveChatMessage);
  };
};

export default subscribeToSocketEventsForUI;

*/
