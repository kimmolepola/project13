import { chatMessageTimeToLiveSeconds } from './parameters';

export const receiveData = (
  remoteId,
  data,
  setChatMessages,
  objectIds,
  objects,
) => {
  console.log('receive data:', data);
  switch (data.type) {
    case 'update': // only non-main will receive these
      for (let i = objectIds.current.length - 1; i > -1; i -= 1) {
        const objectLocal = objects.current[objectIds.current[i]];
        const objectBackend = data.update[objectIds.current[i]];
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
      break;
    case 'keyDowns': // only main will receive these
      if (objects.current[remoteId]) {
        const { keyDowns } = objects.current[remoteId];
        keyDowns.splice(0, keyDowns.length);
        keyDowns.push(data.keysDowns);
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
    case 'chatMessage': {
      const message = { ...data, userId: remoteId };
      setChatMessages((x) => [message, ...x]);
      setTimeout(
        () => setChatMessages((x) => x.filter((xx) => xx !== message)),
        chatMessageTimeToLiveSeconds * 1000,
      );
      break;
    }
    default:
      break;
  }
};

export const sendDataOnRelay = (data, relay) => {
  console.log('send relay:', data);
  if (relay) relay.emit('data', data);
};

export const sendDataOnUnorderedChannels = (data, channels) => {
  console.log('send channel:', data);
  const stringData = JSON.stringify(data);
  channels.unordered.forEach((x) => x.send(stringData));
};

export const sendDataOnOrderedChannelsAndRelay = (arg, channels, relay) => {
  let data;
  switch (arg.type) {
    case 'chatMessage':
      data = {
        type: arg.type,
        chatMessageId: Math.random().toString(),
        chatMessage: arg.chatMessage,
      };
      receiveData(arg.id, data, arg.setChatMessages);
      break;
    default:
      data = arg;
  }
  const dataString = JSON.stringify(data);
  channels.ordered.forEach((x) => x.send(dataString));
  if (relay) relay.emit('data', data);
};
