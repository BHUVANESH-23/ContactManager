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

        
        const duplicates = await Contact.find({ phoneNumber, userMail }).sort({ createdAt: -1 });

        
        if (duplicates.length > 1) {
            const contactsToDelete = duplicates.slice(1); 
            await Contact.deleteMany({ _id: { $in: contactsToDelete.map(contact => contact._id) } });
        }

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact', error });
    }
});



router.get('/', async (req, res) => {
    try {
        const userMail = req.headers['usermail'];  
        const contacts = await Contact.find({ userMail });  
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, phoneNumber, email } = req.body; 

        
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, phoneNumber, email },
            { new: true, runValidators: true } 
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(updatedContact); 
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
});


router.delete('/:id', async (req, res) => {
    
    
    try {
        const { id } = req.params; 

        
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
});





module.exports = router;