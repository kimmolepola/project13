require('dotenv').config();

const options = {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(options);

let main;

io.on('connection', (socket) => {
  console.log('connected:', socket.id);
  socket.on('data', (data) => {
    console.log('data', data);
    if (socket === main) {
      socket.broadcast.emit('data', data);
    } else if (main) {
      main.emit('data', data);
    }
  });
  socket.on('message', (message) => {
    if (socket === main) {
      socket.broadcast.emit('message', message);
    } else if (main) {
      main.emit('message', message);
    }
  });
  socket.on('main', () => {
    main = socket;
  });
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });
});

io.listen(process.env.PORT);
