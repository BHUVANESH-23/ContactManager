const jwt = require('jsonwebtoken');

const generateResetToken = (user) => {
  const secret = process.env.JWT_SECRET_KEY;

 
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

 
  return jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: '15m' }
  );
};

module.exports = { generateResetToken };
