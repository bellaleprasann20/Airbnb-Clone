const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  getMyProperties
} = require('../controllers/property.controller');

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- ROUTES ---

// 1. Public Routes
router.get('/', getProperties);
router.get('/:id', getProperty);

// 2. Protected Routes (User must be logged in)
router.use(protect);

// 3. Host/Admin Routes
// Note: We put specific paths like /user/listings ABOVE generic /:id if they conflict.
// Here /user/listings is unique enough.
router.get('/user/listings', authorize('host', 'admin'), getMyProperties);

// FIX: Added 'upload.array' to handle the incoming FormData images
router.post(
  '/', 
  authorize('host', 'admin'), 
  upload.array('images', 10), 
  createProperty
);

// FIX: Added 'upload.array' for updating images
router.patch(
  '/:id/images', 
  authorize('host'), 
  upload.array('images', 10), 
  uploadPropertyImages
);

router.route('/:id')
  .patch(
    authorize('host', 'admin'), 
    upload.array('images', 10), // Allow updating images via patch too
    updateProperty
  )
  .delete(
    authorize('host', 'admin'), 
    deleteProperty
  );

module.exports = router;