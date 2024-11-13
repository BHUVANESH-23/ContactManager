
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const Contact = require('../Models/contact');  
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://contactmanager-yvwy.onrender.com/api/google-contacts/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


router.get('/', (req, res) => {
  const userMail = req.query.userMail;

  if (!userMail) {
    return res.status(400).send('User email not provided');
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/contacts.readonly'],
    state: encodeURIComponent(userMail),  
  });

  res.redirect(authUrl);
});


router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const userMail = decodeURIComponent(req.query.state); 

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

    
    const contactsToSave = connections.map(person => ({
      name: person.names ? person.names[0].displayName : 'No Name',
      email: person.emailAddresses ? person.emailAddresses[0].value : 'No Email',
      phoneNumber: person.phoneNumbers ? person.phoneNumbers[0].value : 'No Phone Number',
      userMail,  
    }));

    
    await Contact.insertMany(contactsToSave);

    
    res.redirect('https://contact-manager-fawn-phi.vercel.app//savedContacts');  
  } catch (error) {
    console.error('Error retrieving and saving Google contacts:', error);
    res.status(500).send('Error retrieving and saving Google contacts');
  }
});

module.exports = router;
