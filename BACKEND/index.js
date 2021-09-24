require('express-async-errors');
require('dotenv').config();
const JWT = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ['GET', 'POST'],
  },
});

const connection = require('./db');

const port = process.env.PORT;

(async function db() {
  await connection();
})();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/v1', require('./routes/index.route'));

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message });
});

server.listen(port, () => {
  console.log('Listening to Port ', port);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// signaling server
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const JWTSecret = process.env.JWT_SECRET;

const clients = {};
let main = null;

io.use((socket, next) => {
  const { token } = socket.handshake.auth;
  console.log(token);
  let err = null;
  if (token) {
    const decodedToken = JWT.verify(token, JWTSecret);
    if (!decodedToken.id) {
      err = new Error('Invalid token');
      err.statusCode = 401;
      err.data = { content: 'Please retry later' }; // additional details
    }
  }
  next(err);
});

io.on('connection', (socket) => {
  const { token } = socket.handshake.auth;
  console.log('connection, auth:', token);
  const decodedId = token
    ? JWT.verify(socket.handshake.auth.token, JWTSecret).id
    : null;
  const id = decodedId || Math.random().toString();
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

module.exports = app;
