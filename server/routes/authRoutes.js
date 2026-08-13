const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPHandler, setPIN } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPHandler);
router.post('/set-pin', protect, setPIN);

module.exports = router;