const nodemailer = require('nodemailer');

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SMTP_USER = 'mjamalnasir7@gmail.com';
const SMTP_PASS = 'yvqsjcgzmvkwyqjpf';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log('Verification Error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
    process.exit(0);
});
