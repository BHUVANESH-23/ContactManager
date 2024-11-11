const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const login = require('./routes/login.js');
const signUp = require('./routes/signUp.js');
const auth = require('./routes/auth.js');
const protectedRoute = require('./routes/protected.js');
const contact = require('./routes/contact.js');
const forgotPass = require('./routes/forgotPass.js');
const resetPass = require('./routes/resetPass.js');
const googleContacts = require('./routes/googleContact.js')
const del = require('./routes/delete.js')
const mail = require('./routes/mail.js')

require('dotenv').config();

const app = express();
app.use(cors({
  exposedHeaders:"*"
}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Bhuvanesh:Bhuv1%4023o6@cluster0.gs8k4.mongodb.net/')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/login',login);
app.use('/api/signup',signUp);
// app.use('/user/',auth);
app.use('/api/contact',contact);
app.use('/api/',protectedRoute);
app.use('/api/forgot-password',forgotPass)
app.use('/api/reset-password',resetPass)
app.use('/api/google-contacts', googleContacts);
app.use('/api/del',del)
app.use('/api/send-mail',mail)



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

