const express = require('express');
const appoinmentController = require('../controllers/appoinmentController');
const router = express.Router();


router.post('/appoinment',appoinmentController.appoinment);
router.post('/appoinment/update',appoinmentController.appoinmentUpdate);
router.post('/admin/appointment/delete',appoinmentController.adminAppDelete);


module.exports = router;