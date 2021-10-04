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
const {
  addClientUnique,
  removeClient,
  getClients,
  setMain,
  getMain,
} = require('./clients');

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
  const id = token
    ? JWT.verify(socket.handshake.auth.token, JWTSecret).id
    : null;
  const unique = addClientUnique(id, socket);
  if (!id || !unique) {
    socket.emit('fail', id ? 'duplicateSessionError' : 'tokenError');
    socket.disconnect();
    console.log(
      id
        ? 'duplicate session, socket disconnect'
        : 'token error, socket disconnect',
    );
  } else {
    console.log('connected:', id);
    socket.emit('init', id);

    if (!getMain()) {
      setMain(id);
      console.log('main:', getMain());
      socket.emit('main', getMain());
    } else {
      socket.emit('connectToMain', getMain());
    }

    const signaling = ({ remoteId, description, candidate }) => {
      if (getClients()[remoteId]) {
        getClients()[remoteId].emit('signaling', {
          id,
          description,
          candidate,
        });
      }
    };

    const disconnect = () => {
      socket.broadcast.emit('peerDisconnect', id);
      console.log('disconnect,', id);
      removeClient(id);
      if (getMain() && getMain() === id) {
        setMain(null);
        Object.keys(getClients()).forEach((x) => {
          if (!x.includes('guest_') && getMain() === null) {
            setMain(x);
            console.log('main:', getMain());
            getClients()[x].emit('main', getMain());
          } else {
            getClients()[x].emit('connectToMain', getMain());
          }
        });
        if (!getMain()) {
          socket.broadcast.emit('nomain');
        }
      }
    };

    socket.on('signaling', signaling);
    socket.on('disconnect', disconnect);
  }
});

module.exports = app;
