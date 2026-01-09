const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true // Amount in Rupees
  },
  currency: {
    type: String,
    default: 'INR'
  },
  gateway: {
    type: String,
    enum: ['stripe', 'razorpay'],
    required: true
  },
  // Unique ID from the provider (e.g., razorpay_payment_id or stripe_intent_id)
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Allows nulls for pending payments but ensures uniqueness for paid ones
  },
  // The ID created by the gateway for the order session
  gatewayOrderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'captured', 'failed', 'refunded'],
    default: 'pending'
  },
  // Store the raw response from the gateway for debugging
  rawResponse: {
    type: Object
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create index for faster lookup during webhooks
PaymentSchema.index({ gatewayOrderId: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);