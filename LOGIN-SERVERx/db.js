const mongoose = require('mongoose');

const { DB_URL } = process.env;

module.exports = async function connection() {
  try {
    console.log('connecting to', DB_URL);
    await mongoose.connect(
      DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
      },
      // eslint-disable-next-line consistent-return
      (error) => {
        if (error) return new Error('Failed to connect to database');
        console.log('connected');
      },
    );
  } catch (error) {
    console.log(error);
  }
};
