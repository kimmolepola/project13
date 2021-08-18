require('dotenv').config();

const options = {
  cors: {
    origin: 'http://localhost:3000',
    // origin: "https://project13-app.herokuapp.com",
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(options);

const sockets = {};

io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  let ownId;
  let pair = null;
  socket.on('disconnect', (message) => {
    delete sockets[ownId];
    console.log('disconnect', message);
  });
  socket.on('peerIds', (arg) => {
    ownId = arg.localId;
    pair = arg.remoteId;
    sockets[arg.localId] = socket;
    if (sockets[arg.remoteId]) {
      socket.emit('relayState', 'ready');
      sockets[arg.remoteId].emit('relayState', 'ready');
      console.log('relay connection ready');
    }
  });
  socket.on('relay', (arg) => {
    if (pair && sockets[pair]) {
      sockets[pair].emit('relay', arg);
    } else {
      console.log('no pair');
    }
  });
});

io.listen(process.env.PORT);
