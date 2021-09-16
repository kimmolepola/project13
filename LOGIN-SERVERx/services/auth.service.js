const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const Token = require('../models/Token.model');
const sendEmail = require('../utils/email/sendEmail');

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

/* eslint-disable no-underscore-dangle, no-return-assign, no-param-reassign */
const login = async (data) => {
  const user = await User.findOne({ username: data.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(data.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw new Error('Invalid username or password', 401);
  }

  const token = JWT.sign({ id: user._id }, JWTSecret);

  return (data = {
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

const signup = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (user) {
    throw new Error('Email already exist', 422);
  }
  data.username = Math.random().toString();
  user = new User(data);

  const token = JWT.sign({ id: user._id }, JWTSecret);
  await user.save();

  return (data = {
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email does not exist');

  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

  sendEmail(
    user.email,
    'Password Reset Request',
    {
      name: user.name,
      link,
    },
    './template/requestResetPassword.handlebars',
  );
  return link;
};

const resetPassword = async (userId, token, password) => {
  const passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error('Invalid or expired password reset token');
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error('Invalid or expired password reset token');
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true },
  );

  const user = await User.findById({ _id: userId });

  sendEmail(
    user.email,
    'Password Reset Successfully',
    {
      name: user.name,
    },
    './template/resetPassword.handlebars',
  );

  await passwordResetToken.deleteOne();

  return true;
};

module.exports = {
  login,
  signup,
  requestPasswordReset,
  resetPassword,
};
