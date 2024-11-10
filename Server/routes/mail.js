const express = require('express');
const Contact = require('../Models/contact');
const User = require('../Models/User');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
require('dotenv').config();

const router = express.Router();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or another email service provider
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Utility function to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

router.post('/', upload.single('file'), (req, res) => {
    const { email, subject, body } = req.body;
    const file = req.file; // File sent from the frontend

    // Check if the email field is present
    if (!email) {
        return res.status(400).send('Email address is required');
    }

    // Validate the email format
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email address');
    }

    // Ensure file is present
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const mailOptions = {
        from: EMAIL_USER, // Use the EMAIL_USER from environment variable
        to: email, // Recipient's email address
        subject: subject,
        text: body,
        attachments: [
            {
                filename: 'contacts.txt',
                content: file.buffer, // Attach the file buffer
                encoding: 'base64',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
    });
});

module.exports = router;
