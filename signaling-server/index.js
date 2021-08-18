require('dotenv').config();
const io = require('socket.io')({
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const clients = {};

io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  const id = Object.keys(clients).length ? Math.random() : 'main';
  clients[id] = socket;

  socket.emit('init', id);

  socket.on('signaling', ({ remoteId, description, candidate }) => {
    if (clients[remoteId]) {
      clients[remoteId].emit('signaling', {
        id,
        description,
        candidate,
      });
    }
  });

  socket.on('disconnect', (message) => {
    delete clients[id];
    console.log('disconnect,', message);
  });
});

io.listen(process.env.PORT);
