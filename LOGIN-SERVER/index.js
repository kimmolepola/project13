require('express-async-errors');
require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const { networkInterfaces } = require('os');
const connection = require('./db');

const port = 8060;

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

app.listen(port, () => {
  console.log('Listening to Port ', port);
});

const nets = networkInterfaces();
console.log(nets);

module.exports = app;
