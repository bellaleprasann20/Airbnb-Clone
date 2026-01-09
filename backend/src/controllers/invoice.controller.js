const invoiceService = require('../services/invoice.service');
const path = require('path');

/**
 * Generate and download a PDF invoice for a specific booking
 * GET /api/invoices/:bookingId/download
 */
exports.downloadInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // 1. Get invoice data and verify ownership
    const invoice = await invoiceService.getInvoiceByBooking(bookingId, userId);

    // 2. Generate PDF path/stream
    // We pass the invoice data to our utility to create the physical file
    const pdfPath = await invoiceService.generateInvoicePDF(invoice);

    // 3. Send file to client
    res.download(pdfPath, `invoice-${invoice.invoiceNumber}.pdf`, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice details (JSON format) for the UI
 * GET /api/invoices/:bookingId
 */
exports.getInvoiceDetails = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const invoice = await invoiceService.getInvoiceByBooking(bookingId, userId);

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all invoices for a user (Guest)
 * GET /api/invoices
 */
exports.getMyInvoices = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const invoices = await invoiceService.getAllUserInvoices(userId);

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};