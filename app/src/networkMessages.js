import { chatMessageTimeToLiveSeconds } from './parameters';

export const receiveData = (data, objects, objectIds, id) => {
  console.log('data:', data);
  for (let i = objectIds.current.length - 1; i > -1; i -= 1) {
    const objectLocal = objects.current[objectIds[i]];
    const objectBackend = data[objectIds[i]];
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

export const receiveMessage = (data, setMessages) => {
  setMessages((x) => [data, ...x]);
  setTimeout(
    () => setMessages((x) => x.filter((xx) => xx !== data)),
    chatMessageTimeToLiveSeconds * 1000,
  );
};

export const sendData = (data, channels, relay) => {
  const stringData = JSON.stringify(data);
  channels.data.forEach((x) => x.send(stringData));
  if (relay) relay.emit('data', data);
};

export const sendMessage = (setMessages, message, id, channels, relay) => {
  const data = {
    messageId: Math.random().toString(),
    userId: id,
    message,
  };
  const stringData = JSON.stringify(data);
  channels.message.forEach((x) => x.send(stringData));
  if (relay) relay.emit('message', data);
  receiveMessage(data, setMessages);
};
