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
  const id = Math.random().toString();
  console.log('connected:', id);
  clients[id] = socket;
  console.log(Object.keys(clients));

  socket.emit('init', id);

  if (!main) {
    main = id;
    console.log('main:', main);
    socket.emit('main', main);
  } else {
    socket.emit('connectToMain', main);
  }

  const signaling = ({ remoteId, description, candidate }) => {
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
    console.log('disconnect,', id);
    delete clients[id];
    if (main && main === id) {
      main = null;
      Object.keys(clients).forEach((x) => {
        if (main === null) {
          main = x;
          console.log('main:', main);
          clients[x].emit('main', main);
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
