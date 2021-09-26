const JWT = require('jsonwebtoken');
const User = require('../models/User.model');
const { getMain } = require('../main');

const JWTSecret = process.env.JWT_SECRET;

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
const getUser = async (token) => {
  console.log('get user, token:', token);
  const decodedToken = JWT.verify(token, JWTSecret);
  const user = await User.findOne({ _id: decodedToken.id });

  const data = {
    score: user.score,
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  };
  return data;
};

const saveGameState = async (token, data) => {
  console.log('x save game state', token, data);
  const decodedToken = JWT.verify(token, JWTSecret);
  console.log('get main:', getMain());
  if (!token || !decodedToken.id || decodedToken.id !== getMain()) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  try {
    const promises = data.map((x) => {
      console.log('save:', x.playerId, x.score);
      return User.updateOne(
        { _id: x.playerId },
        { $set: { score: x.score } },
        { new: true, runValidators: true, context: 'query' },
      );
    });
    const pro = await Promise.all(promises);
    console.log('saved', pro);
  } catch (error) {
    console.error('failed to save game state');
    throw new Error('Failed to save game state');
  }
  return true;
};

const updateUsername = async (token, data) => {
  console.log(token, data);
  const decodedToken = JWT.verify(token, JWTSecret);
  if (!token || !decodedToken.id) {
    const err = new Error('Invalid or missing token');
    err.statusCode = 401;
    throw err;
  }

  try {
    await User.updateOne(
      { _id: decodedToken.id },
      { $set: { username: data.username } },
      { new: true, runValidators: true, context: 'query' },
    );
  } catch (error) {
    throw new Error('Failed to update username');
  }

  const user = await User.findOne({ _id: decodedToken.id });

  return (data = {
    score: user.score,
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

module.exports = {
  getUser,
  saveGameState,
  updateUsername,
};
