const JWT = require('jsonwebtoken');
const User = require('../models/User.model');

const JWTSecret = process.env.JWT_SECRET;

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

  const id2token = JWT.sign({ id2: user.id2 }, JWTSecret);

  /* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
  return (data = {
    id2token,
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

module.exports = {
  updateUsername,
};
