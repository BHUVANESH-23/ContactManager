// routes/googleContacts.js
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const Contact = require('../Models/contact');  // Import the Contact model
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5000/api/google-contacts/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Request Google Contacts with userMail in query params
router.get('/', (req, res) => {
  const userMail = req.query.userMail;

  if (!userMail) {
    return res.status(400).send('User email not provided');
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/contacts.readonly'],
    state: encodeURIComponent(userMail),  // Store userMail in the state parameter
  });

  res.redirect(authUrl);
});

// Step 2: Handle Google Callback and Fetch Contacts
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const userMail = decodeURIComponent(req.query.state); // Retrieve userMail from the state parameter

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const peopleService = google.people({ version: 'v1', auth: oauth2Client });
    const response = await peopleService.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,phoneNumbers',
      pageSize: 10
    });

    const connections = response.data.connections || [];

    // Extract the contacts and format them for the database
    const contactsToSave = connections.map(person => ({
      name: person.names ? person.names[0].displayName : 'No Name',
      email: person.emailAddresses ? person.emailAddresses[0].value : 'No Email',
      phoneNumber: person.phoneNumbers ? person.phoneNumbers[0].value : 'No Phone Number',
      userMail,  // Attach the userMail retrieved from the state
    }));

    // Save the contacts to MongoDB
    await Contact.insertMany(contactsToSave);

    // Redirect back to the frontend or return a success message
    res.redirect('http://localhost:5173/savedContacts');  // Redirect user to saved contacts page
  } catch (error) {
    console.error('Error retrieving and saving Google contacts:', error);
    res.status(500).send('Error retrieving and saving Google contacts');
  }
});

module.exports = router;
