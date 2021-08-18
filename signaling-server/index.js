require('dotenv').config();
const io = require('socket.io')({
  cors: {
    origin: 'http://localhost:3000',
    // origin: "https://project13-app.herokuapp.com",
    methods: ['GET', 'POST'],
  },
});

const clients = {};

io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  const id = Math.random();
  clients[id] = socket;

  socket.emit('init', { id, first: Object.keys().length === 1 });

  socket.on('signaling', ({ id: remoteId, message }) => {
    if (clients[remoteId]) {
      clients[remoteId].emit('signaling', message);
    } else {
      socket.emit('message', 'no other connection');
    }
  });

  socket.on('disconnect', (message) => {
    delete clients[id];
    console.log('disconnect,', message);
  });
});

io.listen(process.env.PORT);
