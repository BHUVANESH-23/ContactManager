// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Import the User model
require('dotenv').config();

const router = express.Router();

// Generate JWT token route
router.post('/generateToken', (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = { time: Date(), userId: 12 };
  const token = jwt.sign(data, jwtSecretKey);
  res.send(token);
});

// Validate JWT token route
router.get('/validateToken', (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.send('Successfully Verified');
    } else {
      return res.status(401).send('Access Denied');
    }
  } catch (error) {
    return res.status(401).send('Access Denied');
  }
});

module.exports = router;