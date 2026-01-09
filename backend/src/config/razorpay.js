const Razorpay = require('razorpay');
const config = require('./env');

/**
 * Initialize Razorpay instance with credentials from env.js
 * These keys are used to authenticate all API requests to Razorpay.
 */
const razorpayInstance = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

/**
 * Utility to verify Razorpay signatures (important for security)
 * This ensures that the payment data received in the webhook/callback 
 * actually came from Razorpay and hasn't been tampered with.
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', config.RAZORPAY_KEY_SECRET);

  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  razorpayInstance,
  verifyRazorpaySignature
};