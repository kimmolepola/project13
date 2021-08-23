import { chatMessageTimeToLiveSeconds } from './parameters';

export const receiveData = (data, objects, objectIds) => {
  console.log('data:', data);
  for (let i = objectIds.current.length - 1; i > -1; i -= 1) {
    const objectLocal = objects.current[objectIds.current[i]];
    const objectBackend = data[objectIds.current[i]];
    if (objectLocal && objectBackend) {
      // if (objectIds.current[i] !== id) {
      //  objectLocal.keyDowns = objectBackend.keyDowns;
      // }
      objectLocal.rotationSpeed = objectBackend.rotationSpeed;
      objectLocal.speed = objectBackend.speed;
      objectLocal.backendPosition = objectBackend.position;
      objectLocal.backendQuaternion = objectBackend.quaternion;
    }
  }
};

export const sendData = (data, channels, relay) => {
  const stringData = JSON.stringify(data);
  channels.unordered.forEach((x) => x.send(stringData));
  if (relay) relay.emit('data', data);
};

export const receiveMessage = (
  remoteId,
  data,
  setMessages,
  objectIds,
  objects,
) => {
  switch (data.type) {
    case 'keyDown':
      if (objects.current[remoteId]) {
        objects.current[remoteId].keyDowns.push(data.key);
      }
      break;
    case 'keyUp':
      if (objects.current[remoteId]) {
        const index = objects.current[remoteId].keyDowns.findIndex(
          (x) => x === data.key,
        );
        if (index !== -1) objects.current[remoteId].keyDowns.splice(index, 1);
      }
      break;
    case 'setIds':
      objectIds.current.splice(0, objectIds.current.length);
      objectIds.current.push(...data.ids);
      break;
    case 'deleteObject': {
      const index = objectIds.current.findIndex((x) => x === data.id);
      if (index !== -1) objectIds.current.splice(index, 1);
      break;
    }
    case 'createObject':
      objectIds.current.push(data.id);
      break;
    case 'chat':
      setMessages((x) => [data, ...x]);
      setTimeout(
        () => setMessages((x) => x.filter((xx) => xx !== data)),
        chatMessageTimeToLiveSeconds * 1000,
      );
      break;
    default:
      break;
  }
};

export const sendMessage = (message, channels, relay) => {
  let obj;
  switch (message.type) {
    case 'keyDown':
      break;
    case 'keyUp':
      break;
    case 'chat':
      obj = {
        messageId: Math.random().toString(),
        userId: message.id,
        message: message.message,
      };
      receiveMessage(obj, message.setMessages);
      break;
    default:
      obj = message;
  }
  const stringObj = JSON.stringify(obj);
  channels.ordered.forEach((x) => x.send(stringObj));
  if (relay) relay.emit('message', obj);
};
