const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardContoller');
const verifyToken = require('../middlewares/authMiddleware');


router.get('/userData',verifyToken,dashboardController.userData);
router.get('/admin/dashboard',dashboardController.adminDashboard);
router.get('/analytics',dashboardController.analytics);

module.exports = router;