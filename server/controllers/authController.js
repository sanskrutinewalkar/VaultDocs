const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateOTP, verifyOTP } = require('../utils/otp');

const otpStore = new Map();

const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

    const { otp, base32Secret } = generateOTP();

    // Store OTP session temporarily (5 min expiry)
    otpStore.set(mobile, { base32Secret, expiresAt: Date.now() + 5 * 60 * 1000 });

    // TODO: integrate Twilio here to actually send SMS
    console.log(`OTP for ${mobile}: ${otp}`); // dev-only, remove before production

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const verifyOTPHandler = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile and OTP are required' });
    }

    const session = otpStore.get(mobile);
    if (!session || Date.now() > session.expiresAt) {
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    }

    const isValid = verifyOTP(otp, session.base32Secret);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }


    otpStore.delete(mobile);

    
    let user = await User.findOne({ mobile });
    if (!user) {
      user = await User.create({ mobile, isVerified: true });
    } else {
      user.isVerified = true;
      await user.save();
    }


    const token = jwt.sign({ id: user._id, mobile: user.mobile }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: { id: user._id, mobile: user.mobile, hasPIN: !!user.pinHash },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const setPIN = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id; // comes from JWT middleware

    if (!pin || pin.length !== 6) {
      return res.status(400).json({ message: 'PIN must be 6 digits' });
    }

    const pinHash = await bcrypt.hash(pin, 10);
    await User.findByIdAndUpdate(userId, { pinHash });

    res.status(200).json({ message: 'PIN set successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { sendOTP, verifyOTPHandler, setPIN };