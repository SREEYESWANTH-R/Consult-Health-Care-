const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const appoinmentController = require('../controllers/appoinmentController')

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/adminlogin',authController.adminLogin);
router.post('/appoinment',appoinmentController.appoinment);
router.post('/appoinment/update',appoinmentController.appoinmentUpdate);
router.post('/admin/appointment/delete',authController.adminAppDelete);


module.exports = router;
