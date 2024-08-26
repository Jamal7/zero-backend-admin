const nodemailer = require('nodemailer');
const SMTPTransport = require('nodemailer/lib/smtp-transport');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 30000 // 30 seconds
});

function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: '"zero" <developer@tekvill.com>',
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail
};
