const nodemailer = require('nodemailer');
const config = require('../config/env'); // Import the fixed bridge

const sendEmail = async (options) => {
  // This will now print the actual values from your config
  console.log(`📧 Attempting connect: ${config.EMAIL_HOST}:${config.EMAIL_PORT}`);
  console.log(`📧 Using User: ${config.EMAIL_USER ? 'FOUND' : 'MISSING'}`);

  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `${config.FROM_NAME} <${config.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;