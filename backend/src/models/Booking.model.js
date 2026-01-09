const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: [true, 'Please add a check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please add a check-out date']
  },
  numberOfGuests: {
    type: Number,
    required: true,
    default: 1
  },
  // Price at the time of booking
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR' // Changed from USD to INR
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay'],
    required: true
  },
  gatewayOrderId: String, 
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optimization: Indexing for date availability queries
BookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', BookingSchema);