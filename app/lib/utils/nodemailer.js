import nodemailer from 'nodemailer';

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

export const sendEmail = ({ to, subject, text, html }) => {
  console.log('Sending email to:', to);
  const mailOptions = {
    from: `Zero App <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  };
  console.log('Mail options:', mailOptions);

  return transporter.sendMail(mailOptions);
};
