const paymentService = require('../services/payment.service');

/**
 * Initiate a payment session
 * This is called after a booking is created in 'pending' status
 * POST /api/payments/initiate
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { bookingId, gateway } = req.body; // gateway: 'stripe' or 'razorpay'
    const userId = req.user.id;

    const paymentData = await paymentService.processPayment(bookingId, userId, gateway);

    res.status(200).json({
      success: true,
      message: `Payment initiated via ${gateway}`,
      data: paymentData // Contains Stripe Session URL or Razorpay Order ID
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay Payment
 * Specifically for Razorpay's frontend-to-backend verification flow
 * POST /api/payments/verify-razorpay
 */
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const verification = await paymentService.verifyRazorpay(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: verification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment history for the logged-in user
 * GET /api/payments/history
 */
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const history = await paymentService.getUserPaymentHistory(req.user.id);
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};