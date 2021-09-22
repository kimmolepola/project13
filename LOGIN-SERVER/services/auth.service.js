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
  let user;
  if (data.username.includes('@')) {
    user = await User.findOne({ email: data.username });
  } else {
    user = await User.findOne({ username: data.username });
  }
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(data.password, user.password);

  if (!(user && passwordCorrect)) {
    const err = new Error('Invalid username, email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = JWT.sign({ id: user._id }, JWTSecret);
  const id2token = JWT.sign({ id2: user.id2 }, JWTSecret);

  return (data = {
    id2token,
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

const signup = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (user) {
    const err = new Error('Email already exist');
    err.statusCode = 409;
    throw err;
  }
  data.id2 = Math.random().toString();
  data.username = Math.random().toString();
  user = new User(data);

  const token = JWT.sign({ id: user._id }, JWTSecret);
  const id2token = JWT.sign({ id2: user.id2 }, JWTSecret);
  await user.save();

  try {
    await sendEmail(
      user.email,
      'Welcome',
      {
        name: user.username,
      },
      './template/welcome.handlebars',
    );
  } catch (err) {
    console.error('Email service error');
  }

  return (data = {
    id2token,
    userId: user._id,
    email: user.email,
    username: user.username,
    token,
  });
};

const requestPasswordReset = async (username) => {
  // const user = await User.findOne({ email });
  let user;
  if (username.includes('@')) {
    user = await User.findOne({ email: username });
  } else {
    user = await User.findOne({ username });
  }
  if (!user) {
    const err = new Error('User does not exist');
    err.statusCode = 422;
    throw err;
  }

  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  console.log('new, id:', user._id, 'token:', hash);

  // const link = `https://${clientURL}/passwordreset?token=${resetToken}&id=${user._id}`;
  const link = `http://${clientURL}/resetpassword?token=${resetToken}&id=${user._id}`;

  try {
    await sendEmail(
      user.email,
      'Password Reset Request',
      {
        name: user.username,
        link,
      },
      './template/requestResetPassword.handlebars',
    );
    return true;
  } catch (err) {
    throw new Error('Email service error');
  }
};

const resetPassword = async (userId, token, password) => {
  console.log(token);
  console.log(await bcrypt.hash(token, Number(bcryptSalt)));

  const passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    const err = new Error('Invalid or expired password reset token');
    err.statusCode = 400;
    throw err;
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    const err = new Error('Invalid or expired password reset token');
    err.statusCode = 400;
    throw err;
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true },
  );

  const user = await User.findById({ _id: userId });

  await passwordResetToken.deleteOne();

  try {
    await sendEmail(
      user.email,
      'Password Reset Successfully',
      {
        name: user.username,
      },
      './template/resetPassword.handlebars',
    );
    return true;
  } catch (error) {
    throw new Error('Email service error');
  }
};

module.exports = {
  login,
  signup,
  requestPasswordReset,
  resetPassword,
};
