const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, token, otp) => {
  const resetLink = `http://localhost:5000/reset-password?token=${token}`; // The reset link with the token

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Use the following OTP: ${otp}. `,
    
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendPasswordResetEmail;
