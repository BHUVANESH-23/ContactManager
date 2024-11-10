const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
require('dotenv').config();

const router = express.Router();
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

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const accessToken = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1d' });

    const refreshToken = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1d' });

    res.status(200).json({ message: 'User logged in successfully!', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

 
  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh Token Required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtSecretKey);

    const accessToken = jwt.sign({ userId: decoded.userId }, jwtSecretKey, { expiresIn: '1d' });

    res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Refresh Token' });
  }
});

// Route to validate access token
router.get('/validateToken', (req, res) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

 
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Token not provided');
  }

 
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).send('Invalid token format');
  }

 
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Token not provided');
  }

 
  try {
    const verified = jwt.verify(token, jwtSecretKey);
    res.status(200).send('Successfully Verified');
  } catch (error) {
   
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired:', error.message);
      return res.status(401).json({ message: 'Token expired' });
    }

   
    console.error('Token validation failed:', error.message);
    return res.status(401).json({ message: 'Access Denied: Invalid token' });
  }
});

module.exports = router;
