const express = require('express');
const router = express.Router();
const multer = require('multer'); // Added for file handling
const path = require('path');

// Import Controllers
const {
  register,
  login,
  getMe,
  logout,
  updateAvatar, // You will add this to your controller next
  updateDetails,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

// Import Middlewares
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure you have an 'uploads' folder in your backend root
  },
  filename: (req, file, cb) => {
    // Saves file as: user-ID-timestamp.jpg
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

/**
 * @route   POST /api/v1/auth/register
 */
router.post('/register', authLimiter, register);

/**
 * @route   POST /api/v1/auth/login
 */
router.post('/login', authLimiter, login);

/**
 * @route   PATCH /api/v1/auth/update-avatar
 * @access  Private
 */
router.patch('/update-avatar', protect, upload.single('image'), updateAvatar);

/**
 * @route   GET /api/v1/auth/me
 */
router.get('/me', protect, getMe);

/**
 * @route   GET /api/v1/auth/logout
 */
router.get('/logout', logout);

router.patch('/update-details', protect, updateDetails);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;