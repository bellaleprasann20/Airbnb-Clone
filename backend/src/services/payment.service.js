const Razorpay = require('razorpay');

// Initialize Razorpay with your .env credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay Order
 */
const createOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Razorpay Order Creation Failed');
  }
};

/**
 * Verify Payment Signature
 */
const verifyPayment = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  createOrder,
  verifyPayment
};