const jwt = require('jsonwebtoken');

const generateResetToken = (user) => {
  const secret = process.env.JWT_SECRET_KEY; // Make sure this is set in your .env file

  // Ensure the secret is defined
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  // Generate the token with a shorter expiration time for security
  return jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: '15m' } // A more secure expiration time for password resets
  );
};

module.exports = { generateResetToken };
