const express = require('express');
const router = express.Router();
const {upload} = require('../middlewares/multerConfig');
const { addDoctor,editDoctor,docDetails,dashDoctor, deleteDoctor } = require('../controllers/doctorController');

router.post('/addDoctor',upload.single('image'),addDoctor);
router.get('/dashboard/doctors',dashDoctor);
router.get(`/dashboard/docdetails/:id`,docDetails);
router.delete(`/delete-doctor/:DocId`,deleteDoctor);
router.put(`/edit-doctor/:id`,upload.single('image'),editDoctor)


module.exports = router;