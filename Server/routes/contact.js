const express = require('express');
const Contact = require('../Models/contact');
const User = require('../Models/User')
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, phoneNumber, email, userMail } = req.body;
        const newContact = new Contact({ name, phoneNumber, email, userMail });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error });
    }
});


router.get('/', async (req, res) => {
    try {
        const userMail = req.headers['usermail'];  // Get userMail from the request headers
        const contacts = await Contact.find({ userMail });  // Fetch contacts matching the userMail
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
});



module.exports = router;