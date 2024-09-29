const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/adminlogin',authController.adminLogin);
router.post('/logout',verifyToken,authController.logout);
router.put('/change-password',authController.passChange);




module.exports = router;
