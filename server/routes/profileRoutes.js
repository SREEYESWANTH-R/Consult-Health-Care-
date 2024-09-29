const express = require('express');
const { profileDetails, updateProfile } = require('../controllers/profileController');
const router = express.Router();


router.get('/profile/:id',profileDetails);
router.put('/uptprofile/:id',updateProfile);

module.exports = router;