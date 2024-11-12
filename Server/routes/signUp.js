const express = require('express');
const User = require('../Models/User'); // Ensure the path to the User model is correct
const router = express.Router();

// POST route for user registration
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use. Try Logging in' });
    }

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});






module.exports = router;
