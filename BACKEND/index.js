require('express-async-errors');
require('dotenv').config();
const JWT = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const client =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.CLIENT}`
    : `http://${process.env.CLIENT}`;

console.log('client:', client);

const io = require('socket.io')(server, {
  cors: {
    origin: client,
    methods: ['GET', 'POST'],
  },
});

const connection = require('./db');
const { setMain, getMain } = require('./main');

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

// eslint-disable-next-line import/prefer-default-export
module.exports = { getMain };

io.use((socket, next) => {
  const { token } = socket.handshake.auth;
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
  const decodedId = token
    ? JWT.verify(socket.handshake.auth.token, JWTSecret).id
    : null;
  const id = decodedId || `guest${Math.random()}`;
  console.log('connected:', id);
  clients[id] = socket;

  socket.emit('init', id);

  if (!getMain()) {
    setMain(id);
    console.log('main:', getMain());
    socket.emit('main', getMain());
  } else {
    socket.emit('connectToMain', getMain());
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
    if (getMain() && getMain() === id) {
      setMain(null);
      Object.keys(clients).forEach((x) => {
        if (getMain() === null) {
          setMain(x);
          console.log('main:', getMain());
          clients[x].emit('main', getMain());
        } else {
          clients[x].emit('connectToMain', getMain());
        }
      });
    }
  };

  socket.on('signaling', signaling);
  socket.on('disconnect', disconnect);
});

module.exports = app;
