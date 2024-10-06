// const express = require('express');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const router = express.Router();

// router.get('/validateToken', (req, res) => {
//   const jwtSecretKey = process.env.JWT_SECRET_KEY;

//   try {
  
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) return res.status(401).send('Token not provided');

  
//     const verified = jwt.verify(token, jwtSecretKey);

//     console.log("Verified Payload: ", verified);

//     if (verified) {
//       return res.send('Successfully Verified');
//     } else {
//       return res.status(401).send('Access Denied');
//     }
//   } catch (error) {
  
//     if (error.name === 'TokenExpiredError') {
//       console.log('Token expired at:', error.expiredAt);
//       return res.status(401).send('Token expired');
//     }

//     console.log("Token Verification Failed: ", error.message);
//     return res.status(401).send('Access Denied');
//   }
// });

// module.exports = router;
