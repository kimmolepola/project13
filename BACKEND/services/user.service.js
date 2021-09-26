const JWT = require('jsonwebtoken');
const User = require('../models/User.model');

const JWTSecret = process.env.JWT_SECRET;

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
const getUser = async (token) => {
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

const updateUsername = async (token, data) => {
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
  updateUsername,
};
