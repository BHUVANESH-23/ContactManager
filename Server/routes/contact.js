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
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the contact ID from the URL parameters
        const { name, phoneNumber, email } = req.body; // Get the updated details from the request body

        // Find the contact by ID and update it
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, phoneNumber, email },
            { new: true, runValidators: true } // Options: return the updated document and run validation
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(updatedContact); // Send the updated contact back
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
});

// Delete an existing contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the contact ID from the URL parameters

        // Find the contact by ID and delete it
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' }); // Send a success message
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
});




module.exports = router;