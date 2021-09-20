const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// eslint-disable-next-line consistent-return
const sendEmail = async (email, subject, payload, template) => {
  console.log('send email');
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    const compiledTemplate = handlebars.compile(source);
    const options = () => ({
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      html: compiledTemplate(payload),
    });

    // Send email
    return transporter.sendMail(options());
  } catch (error) {
    return false;
  }
};

module.exports = sendEmail;
