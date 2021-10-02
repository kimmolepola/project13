import { io } from 'socket.io-client';
import { receiveData } from './services/game.service';

const setupRelayConnection = ({
  mainHandleNewId,
  setRelay,
  setIds,
  ownId,
  main,
  setConnectionMessage,
  setChatMessages,
  objectIds,
  objects,
  setChannels,
  setMain,
  setRemotes,
  remoteId,
}) => {
  let relaySocket;
  setRelay((x) => {
    relaySocket = x;
    return x;
  });
  if (!relaySocket) {
    relaySocket = io(
      process.env.NODE_ENV === 'production'
        ? `wss://${process.env.REACT_APP_RELAY}`
        : `ws://${process.env.REACT_APP_RELAY}`,
    );
    relaySocket.on('newPeer', () => {
      // to trigger network message of current objects which the new peer will need
      setIds((xx) => [...xx]);
    });
    relaySocket.on('connect', () => {
      relaySocket.emit('clientId', ownId);
      if (main === ownId) {
        relaySocket.emit('main');
        mainHandleNewId(remoteId);
      }
      setConnectionMessage('relay socket connected');
      console.log('relay socket connected');
    });
    relaySocket.on('disconnect', () => {
      setConnectionMessage('relay socket disconnected');
      console.log('relay socket disconnected');
    });
    relaySocket.on('data', (data, clientId) =>
      receiveData(
        clientId,
        data,
        setChatMessages,
        objectIds,
        objects,
        setIds,
        ownId,
        setChannels,
        setRelay,
        setMain,
      ),
    );
    setRelay(relaySocket);
  } else {
    mainHandleNewId(remoteId);
  }
  setRemotes((x) => ({
    ...x,
    [remoteId]: { ...x[remoteId], relaySocket: true },
  }));
};

export default setupRelayConnection;
