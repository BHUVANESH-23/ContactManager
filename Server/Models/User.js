const mongoose = require('mongoose');

// Define UserSchema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpires: { type: Date }
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
