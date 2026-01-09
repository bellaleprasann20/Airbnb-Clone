const express = require('express');
const router = express.Router();

// Import Controllers
const {
  initiatePayment,
  verifyRazorpayPayment,
  getPaymentHistory
} = require('../controllers/payment.controller');

// Import Middlewares
const { protect } = require('../middlewares/auth.middleware');

/**
 * 1. Public Webhooks (No Auth Middleware)
 * These must be defined BEFORE the protect middleware.
 * Payment gateways (Stripe/Razorpay) call these asynchronously.
 */
// router.post('/webhook/stripe', express.raw({type: 'application/json'}), stripeWebhook);
// router.post('/webhook/razorpay', razorpayWebhook);

/**
 * 2. Protected Routes (Require Login)
 */
router.use(protect);

/**
 * @desc    Initiate payment (Create Stripe Session or Razorpay Order)
 * @route   POST /api/v1/payments/initiate
 */
router.post('/initiate', initiatePayment);

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/v1/payments/verify-razorpay
 */
router.post('/verify-razorpay', verifyRazorpayPayment);

/**
 * @desc    Get user's transaction history
 * @route   GET /api/v1/payments/history
 */
router.get('/history', getPaymentHistory);

module.exports = router;