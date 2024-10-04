// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    token = token.split(' ')[1]; // Remove 'Bearer' from token
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const verified = jwt.verify(token, jwtSecretKey);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
