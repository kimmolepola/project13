import { chatMessageTimeToLiveSeconds } from '../../Game/parameters';

const logError = (error, data) => {
  if (
    error.message ===
    "Failed to execute 'send' on 'RTCDataChannel': RTCDataChannel.readyState is not 'open'"
  ) {
    console.log(
      'Failed to send on data channel. This is expected if player disconnected.',
    );
  } else {
    console.error('Error:', error.message, 'Data:', data);
  }
};

export const sendDataOnRelay = (data, relay) => {
  if (relay) {
    try {
      relay.emit('data', data);
    } catch (error) {
      logError(error, data);
    }
  }
};

export const sendDataOnUnorderedChannels = (data, channels) => {
  if (channels.unordered.length) {
    const stringData = JSON.stringify(data);
    channels.unordered.forEach((x) => {
      try {
        x.send(stringData);
      } catch (error) {
        logError(error, data);
      }
    });
  }
};

export const sendDataOnOrderedChannelsAndRelay = (arg, channels, relay) => {
  let data;
  switch (arg.type) {
    case 'chatMessage': {
      data = {
        username: arg.username,
        userId: arg.id,
        type: arg.type,
        chatMessage: arg.chatMessage,
        chatMessageId: arg.chatMessageId,
      };
      // if main is sending its own chat message, not relaying other client's message
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
  if (channels.ordered.length) {
    const dataString = JSON.stringify(data);

    channels.ordered.forEach((x) => {
      try {
        x.send(dataString);
      } catch (error) {
        logError(error, data);
      }
    });
  }
  try {
    if (relay) relay.emit('data', data);
  } catch (error) {
    logError(error, data);
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
    case 'updateObjects': {
      // only non-main will receive these
      objectIds.current.splice(0, objectIds.current.length);
      objectIds.current.push(...data.ids);
      const objs = objects.current;
      data.ids.forEach((x) => {
        const obj = objs[x];
        const dataObj = data.objects[x];
        if (obj && obj.elref) {
          // obj.elref.position.set(...dataObj.startPosition);
          // obj.elref.quaternion.set(...dataObj.startQuaternion);
        } else {
          objs[x] = dataObj;
        }
      });
      setIds(data.ids);
      break;
    }
    case 'chatMessage': {
      let main;
      setMain((x) => {
        main = x;
        return x;
      });
      // if message comes from main trust the userId in the message,
      // otherwise use id given from backend
      const userId = remoteId === main ? data.userId : remoteId;
      const message = {
        ...data,
        userId,
        username: objects.current[userId]
          ? objects.current[userId].username
          : null,
      };
      if (main === ownId) {
        message.mainrelay = true; // main is relaying other client's message
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
