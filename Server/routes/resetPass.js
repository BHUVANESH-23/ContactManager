const express = require('express');
const bcrypt = require('bcrypt');  // Added bcrypt for password hashing
const User = require('../Models/User');
const router = express.Router();

// GET route to serve the reset password form
router.get('/', (req, res) => {
    res.send(`
    <form action="/api/reset-password" method="POST">
      <input type="hidden" name="token" value="${req.query.token}" />
      <label for="password">New Password:</label>
      <input type="password" name="password" required />
      <button type="submit">Reset Password</button>
    </form>
  `);
});

// POST route to handle password reset
router.post('/', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the user based on the reset token and its expiration
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update the user's password directly
        user.password = password; // Set the new password
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpires = undefined; // Clear the token expiration
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
});

module.exports = router;
