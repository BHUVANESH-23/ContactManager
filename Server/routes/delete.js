const express = require('express');
const Contact = require('../Models/contact');
const User = require('../Models/User')
require('dotenv').config();

const router = express.Router();



router.delete('/', async (req, res) => {
    console.log("Delete All route hit"); // Log if route is being triggered
  
    try {
      const userMail = req.headers['usermail']; 
      console.log("Received userMail:", userMail); 
  
      if (!userMail) {
        return res.status(400).json({ message: 'User email is required' });
      }
  
      const result = await Contact.deleteMany({ userMail });
  
      console.log("Delete operation result:", result); 
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No contacts found for this user' });
      }
  
      res.status(200).json({ message: "All contacts deleted successfully." });
    } catch (error) {
      console.error("Error during deletion:", error); 
      res.status(500).json({ message: "Failed to delete all contacts.", error });
    }
  });
  
  
module.exports = router;