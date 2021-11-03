require('dotenv').config();

const options = {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? `https://${process.env.CLIENT}`
        : `http://${process.env.CLIENT}`,
    methods: ['GET', 'POST'],
  },
};

console.log('options:', options);

const io = require('socket.io')(options);

let main;

io.on('connection', (socket) => {
  let id;
  if (main && main !== socket) {
    main.emit('newPeer');
  } else {
    console.log('no main');
  }
  console.log('connected:', socket.id);
  socket.on('clientId', (clientId) => {
    console.log('client id:', clientId);
    id = clientId;
  });
  socket.on('data', (data) => {
    if (socket === main) {
      socket.broadcast.emit('data', data, id);
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
