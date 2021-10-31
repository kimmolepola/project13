import { io } from 'socket.io-client';
import { receiveData } from './services/game.service';

const setupRelayConnection = ({
  connection,
  mainHandleNewId,
  setRelay,
  getRelay,
  setIds,
  ownId,
  main,
  setConnectionMessage,
  setChatMessages,
  objectIds,
  objects,
  setMain,
  remoteId,
}) => {
  if (!getRelay()) {
    const relay = io( // eslint-disable-line
      process.env.NODE_ENV === 'production'
        ? `wss://${process.env.REACT_APP_RELAY}`
        : `ws://${process.env.REACT_APP_RELAY}`,
    );
    setRelay(relay);
    console.log('ygetRelay:', getRelay());
    relay.on('newPeer', () => {
      // to trigger network message of current objects which the new peer will need
      setIds((xx) => [...xx]);
    });
    relay.on('connect', () => {
      relay.emit('clientId', ownId);
      if (main === ownId) {
        relay.emit('main');
        mainHandleNewId(remoteId);
      }
      setConnectionMessage('relay socket connected');
      console.log('relay socket connected');
    });
    relay.on('disconnect', () => {
      setConnectionMessage('relay socket disconnected');
      console.log('relay socket disconnected');
    });
    relay.on('data', (data, clientId) =>
      receiveData(
        clientId,
        data,
        setChatMessages,
        objectIds,
        objects,
        setIds,
        ownId,
        connection,
        setMain,
      ),
    );
  } else {
    mainHandleNewId(remoteId);
  }
};

export default setupRelayConnection;
