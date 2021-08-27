require('dotenv').config();

const options = {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(options);

let main;
let id;

io.on('connection', (socket) => {
  if (main && main !== socket) {
    main.emit('newPeer');
  }
  console.log('connected:', socket.id);
  socket.on('clientId', (clientId) => {
    console.log('client id:', clientId);
    id = clientId;
  });
  socket.on('data', (data) => {
    if (socket === main) {
      socket.broadcast.emit('data', data);
    } else if (main) {
      main.emit('data', data, id);
    }
  });
  socket.on('main', () => {
    console.log('main:', socket.id);
    main = socket;
  });
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });
});

io.listen(process.env.PORT);
