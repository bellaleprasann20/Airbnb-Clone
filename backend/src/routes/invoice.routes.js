const express = require('express');
const router = express.Router();

// Import Controllers
const {
  getMyInvoices,
  getInvoiceDetails,
  downloadInvoice
} = require('../controllers/invoice.controller');

// Import Middlewares
const { protect } = require('../middlewares/auth.middleware');

/**
 * All invoice routes are private
 */
router.use(protect);

/**
 * @desc    Get all invoices for the logged-in user
 * @route   GET /api/v1/invoices
 * @access  Private (Guest)
 */
router.get('/', getMyInvoices);

/**
 * @desc    Get specific invoice details (JSON)
 * @route   GET /api/v1/invoices/:bookingId
 * @access  Private (Owner of booking)
 */
router.get('/:bookingId', getInvoiceDetails);

/**
 * @desc    Generate and download PDF invoice
 * @route   GET /api/v1/invoices/:bookingId/download
 * @access  Private (Owner of booking)
 */
router.get('/:bookingId/download', downloadInvoice);

module.exports = router;