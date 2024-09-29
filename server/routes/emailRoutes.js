const express = require('express');
const  sendMail  = require('../utils/emailService');
const router = express.Router();


router.post('/notify-admin',sendMail);

module.exports = router;

