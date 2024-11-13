const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, token, otp) => {
  const resetLink = `https://contactmanager-yvwy.onrender.com/reset-password?token=${token}`; 

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
