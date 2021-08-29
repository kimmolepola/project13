import { chatMessageTimeToLiveSeconds } from './parameters';

export const sendDataOnRelay = (data, relay) => {
  if (relay) {
    try {
      relay.emit('data', data);
    } catch (error) {
      console.error(error);
    }
  }
};

export const sendDataOnUnorderedChannels = (data, channels) => {
  if (channels.unordered.length) {
    const stringData = JSON.stringify(data);
    try {
      channels.unordered.forEach((x) => x.send(stringData));
    } catch (error) {
      console.error(error);
    }
  }
};

export const sendDataOnOrderedChannelsAndRelay = (arg, channels, relay) => {
  let data;
  switch (arg.type) {
    case 'chatMessage': {
      data = {
        userId: arg.id,
        type: arg.type,
        chatMessage: arg.chatMessage,
        chatMessageId: arg.chatMessageId,
      };
      if (arg.main === arg.id && !arg.mainrelay) {
        arg.setChatMessages((x) => [data, ...x]);
        setTimeout(
          () => arg.setChatMessages((x) => x.filter((xx) => xx !== data)),
          chatMessageTimeToLiveSeconds * 1000,
        );
      }
      break;
    }
    default:
      data = arg;
      break;
  }
  console.log('send, channels:', channels, relay);
  if (channels.ordered.length) {
    const dataString = JSON.stringify(data);
    try {
      console.log('send channels', channels.ordered, data);
      channels.ordered.forEach((x) => x.send(dataString));
    } catch (error) {
      console.error(error);
    }
  }
  try {
    if (relay) relay.emit('data', data);
  } catch (error) {
    console.error(error);
  }
};

export const receiveData = (
  remoteId,
  data,
  setChatMessages,
  objectIds,
  objects,
  setIds,
  ownId,
  setChannels,
  setRelay,
  setMain,
) => {
  switch (data.type) {
    case 'update': // only non-main will receive these
      for (let i = objectIds.current.length - 1; i > -1; i -= 1) {
        const objectLocal = objects.current[objectIds.current[i]];
        const objectBackend = data.update[objectIds.current[i]];
        if (objectLocal && objectBackend) {
          if (objectIds.current[i] !== ownId) {
            objectLocal.controls.left += objectBackend.controlsOverNetwork.left;
            objectLocal.controls.right +=
              objectBackend.controlsOverNetwork.right;
          }
          objectLocal.rotationSpeed = objectBackend.rotationSpeed;
          objectLocal.speed = objectBackend.speed;
          objectLocal.backendPosition = objectBackend.position;
          objectLocal.backendQuaternion = objectBackend.quaternion;
        }
      }
      break;
    case 'controlsOverNetwork': // only main will receive these
      if (objects.current[remoteId]) {
        /* eslint-disable no-param-reassign */
        const { left } = data.controlsOverNetwork;
        const { right } = data.controlsOverNetwork;
        objects.current[remoteId].controlsOverRelay.left += left;
        objects.current[remoteId].controlsOverRelay.right += right;
        objects.current[remoteId].controlsOverChannels.left += left;
        objects.current[remoteId].controlsOverChannels.right += right;
        objects.current[remoteId].controls.left += left;
        objects.current[remoteId].controls.right += right;
        /* eslint-enable */
      }
      break;
    case 'setObjects': {
      objectIds.current.splice(0, objectIds.current.length);
      objectIds.current.push(...data.ids);
      setIds(data.ids);
      const objs = objects.current;
      data.ids.forEach((x) => {
        const obj = objs[x];
        const dataObj = data.objects[x];
        if (obj && obj.elref) {
          console.log('object yes, set');
          obj.elref.position.set(...dataObj.startPosition);
          obj.elref.quaternion.set(...dataObj.startQuaternion);
          console.log(x, obj.elref.position, objects.current[x].elref.position);
        } else {
          console.log('object no');
          objs[x] = {
            startPosition: dataObj.startPosition,
            startQuaternion: dataObj.startQuaternion,
          };
        }
      });
      break;
    }
    case 'chatMessage': {
      let main;
      setMain((x) => {
        main = x;
        return x;
      });
      const message = {
        ...data,
        userId: remoteId === main ? data.userId : remoteId,
      };
      if (main === ownId) {
        message.mainrelay = true;
        message.id = message.userId;
        let channels;
        let relay;
        setChannels((x) => {
          channels = x;
          return x;
        });
        setRelay((x) => {
          relay = x;
          return x;
        });
        sendDataOnOrderedChannelsAndRelay(message, channels, relay);
      }
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
