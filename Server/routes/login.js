const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Import the User model
require('dotenv').config();

const router = express.Router();



// User login route that returns a JWT token
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'User logged in successfully!', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
});


module.exports = router;