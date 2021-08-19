require('dotenv').config();
const io = require('socket.io')({
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const clients = {};
let main = null;

io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  const id = Math.random().toString();
  clients[id] = socket;
  console.log(Object.keys(clients));

  socket.emit('init', id);

  if (!main) {
    main = id;
    socket.emit('main');
  } else {
    socket.emit('connectToMain', main);
  }

  const signaling = ({ remoteId, description, candidate }) => {
    console.log('signaling, remoteId:', remoteId);
    console.log('clients keys:', Object.keys(clients));
    if (clients[remoteId]) {
      clients[remoteId].emit('signaling', {
        id,
        description,
        candidate,
      });
    }
  };

  const disconnect = () => {
    socket.broadcast.emit('peerDisconnect', id);
    console.log('disconnect,', id, 'main:', main);
    delete clients[id];
    if (main === id) {
      console.log('main === id');
      main = null;
      Object.keys(clients).forEach((x) => {
        if (main === null) {
          main = x;
          clients[x].emit('main');
        } else {
          clients[x].emit('connectToMain', main);
        }
      });
    }
  };

  socket.on('signaling', signaling);
  socket.on('disconnect', disconnect);
});

io.listen(process.env.PORT);
