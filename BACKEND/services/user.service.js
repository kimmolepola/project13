const JWT = require('jsonwebtoken');
const User = require('../models/User.model');
const { getMain, getClients } = require('../clients');

const JWTSecret = process.env.JWT_SECRET;

const decode = (token) => {
  const decodedToken = JWT.verify(token, JWTSecret);
  if (!token || !decodedToken.id) {
    const err = new Error('Invalid or missing token');
    err.statusCode = 401;
    throw err;
  }
  return decodedToken;
};

const checkOkToStart = (token) => {
  const { id } = decode(token);
  if (id.includes('guest_') && !getMain()) {
    return {
      success: false,
      reason: 'No hosted games found, please create account to host a game',
    };
  }
  if (getClients()[id]) {
    return { success: false, reason: 'Session already open with this user' };
  }
  return { success: true };
};

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
const getUser = async (token) => {
  const { id } = decode(token);

  if (id.includes('guest')) {
    return { score: 0, userId: id, username: id, token };
  }

  const user = await User.findOne({ _id: id });

  const data = user
    ? {
        score: user.score,
        userId: user._id,
        username: user.username,
        token,
      }
    : null;
  return data;
};

const updateUsername = async (token, data) => {
  const { id } = decode(token);
  if (id.includes('guest')) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  try {
    await User.updateOne(
      { _id: id },
      { $set: { username: data.username } },
      { new: true, runValidators: true, context: 'query' },
    );
  } catch (error) {
    throw new Error('Failed to update username');
  }

  const user = await User.findOne({ _id: id });

  return (data = {
    score: user.score,
    userId: user._id,
    username: user.username,
    token,
  });
};

module.exports = {
  checkOkToStart,
  getUser,
  updateUsername,
};
