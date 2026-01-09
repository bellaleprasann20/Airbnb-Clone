const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const sendEmail = require('../utils/sendEmail');

// Helper function to format user response consistently
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role, // Essential for the Navbar link!
    bookings: user.bookings || []
  };
};

// @desc    Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Create user - role will default to 'guest' if not provided in model
    const user = await User.create({ name, email, password, role });
    const token = user.getSignedJwtToken();

    res.status(201).json({ 
      success: true, 
      token, 
      user: formatUserResponse(user) 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration Error", error: err.message });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('bookings');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.getSignedJwtToken();
    
    res.json({ 
      success: true,
      token, 
      user: formatUserResponse(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login Error" });
  }
};

// @desc    Get current logged in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookings');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      success: true, 
      user: formatUserResponse(user) 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// @desc    Update user details (Name/Email)
const updateDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    }).populate('bookings');

    res.status(200).json({ 
      success: true, 
      user: formatUserResponse(user) 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update Avatar
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "No emoji selected" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { avatar }, 
      { new: true }
    ).populate('bookings');

    res.status(200).json({ 
      success: true, 
      user: formatUserResponse(user) 
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating avatar emoji" });
  }
};

// @desc    Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "No user found with that email" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Vite default port is 5173
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff385c;">Password Reset Request</h2>
        <p>Click the button below to proceed with resetting your password:</p>
        <a href="${resetUrl}" style="background: #ff385c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="margin-top: 20px; color: #777;">This link will expire in 10 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Reset Password
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Reset error" });
  }
};

// @desc    Logout
const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { 
  login, 
  register, 
  getMe, 
  logout, 
  updateAvatar, 
  updateDetails, 
  forgotPassword, 
  resetPassword 
};