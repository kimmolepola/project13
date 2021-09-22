const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new Schema(
  {
    id2: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxLength: 20,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
/* eslint-disable consistent-return, func-names */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});

module.exports = mongoose.model('user', userSchema.plugin(uniqueValidator));
