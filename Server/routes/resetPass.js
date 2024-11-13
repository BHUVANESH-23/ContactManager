const express = require('express');
const bcrypt = require('bcrypt');  
const User = require('../Models/User');
const router = express.Router();


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


router.post('/', async (req, res) => {
    const { token, password } = req.body;

    try {
        
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        
        user.password = password; 
        user.resetToken = undefined; 
        user.resetTokenExpires = undefined; 
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
});

module.exports = router;
