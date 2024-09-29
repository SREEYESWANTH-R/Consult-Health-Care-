const express = require('express');
const { addCart,drugs, cartDetails} = require('../controllers/drugController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/drugs',drugs);
router.put('/add/cart',verifyToken,addCart);
router.get('/cart-details',cartDetails);

module.exports = router