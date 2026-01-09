const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    // Format example: INV-2025-0001
  },
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
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  // Financial Details in INR
  baseAmount: {
    type: Number,
    required: true // nightlyPrice * numberOfNights
  },
  serviceFee: {
    type: Number,
    required: true,
    default: 0
  },
  gstAmount: {
    type: Number,
    default: 0 // For Indian compliance
  },
  totalAmount: {
    type: Number,
    required: true // base + serviceFee + gst
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  pdfUrl: {
    type: String // Link to the file in uploads/ or S3
  },
  status: {
    type: String,
    enum: ['issued', 'paid', 'cancelled', 'refunded'],
    default: 'paid'
  }
}, {
  timestamps: true
});

// Auto-generate a readable Invoice Number before saving
InvoiceSchema.pre('validate', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoiceNumber = `INV-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);