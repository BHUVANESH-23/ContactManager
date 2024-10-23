const express = require('express');
const { z } = require('zod');
const sendPasswordResetEmail = require('../MiddleWare/sendPasswordResetEmail');
const User = require('../Models/User');
const crypto = require('crypto');
const router = express.Router();


const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

router.post('/', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If this email exists, a reset link will be sent to your email.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendPasswordResetEmail(email, user.resetToken, otp);
    return res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error(err);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;  
  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }
    console.log(req.body);
    const user = await User.findOne({
      email,
      resetToken: otp, 
      resetTokenExpires: { $gt: Date.now() } 
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    
    res.status(200).json({ message: 'OTP is valid. You can reset your password.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
});

module.exports = router;
