const JWT = require('jsonwebtoken');
const User = require('../models/User.model');
const { getMain } = require('../clients');

const JWTSecret = process.env.JWT_SECRET;

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
const getGameObject = async (token, id) => {
  const decodedToken = token !== 'null' ? JWT.verify(token, JWTSecret) : null;

  if (!token || !decodedToken || decodedToken.id !== getMain()) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findOne({ _id: id });

  const data = {
    score: user.score,
  };
  return data;
};

const saveGameState = async (token, data) => {
  const decodedToken = JWT.verify(token, JWTSecret);
  if (!token || !decodedToken.id || decodedToken.id !== getMain()) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  try {
    const promises = data.map((x) =>
      User.updateOne(
        { _id: x.playerId },
        { $set: { score: x.score } },
        { new: true, runValidators: true, context: 'query' },
      ),
    );
    const pro = await Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save game state');
  }
  return true;
};

module.exports = {
  getGameObject,
  saveGameState,
};
