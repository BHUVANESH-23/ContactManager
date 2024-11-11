// routes/protected.js
const express = require('express');
const verifyToken = require('../MiddleWare/verifyToken');

const router = express.Router();

// Protected route
router.get('/protectedRoute', verifyToken, (req, res) => {
  res.send('This is a protected route. Access granted.');
});

module.exports = router;