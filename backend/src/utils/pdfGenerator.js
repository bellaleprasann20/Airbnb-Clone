const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF Invoice for a booking
 * @param {Object} invoiceData - The invoice object from the database
 * @param {string} filePath - Where to save the generated PDF
 */
const generateInvoicePDF = (invoiceData, filePath) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream the PDF to the file system
  doc.pipe(fs.createWriteStream(filePath));

  // --- 1. Header ---
  doc
    .fontSize(20)
    .text('INVOICE', { align: 'right' })
    .fontSize(10)
    .text(`Invoice Number: ${invoiceData.invoiceNumber}`, { align: 'right' })
    .text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString('en-IN')}`, { align: 'right' })
    .moveDown();

  // --- 2. Company Info (Your Airbnb Clone Name) ---
  doc
    .fontSize(15)
    .text('Airbnb Clone India Pvt Ltd.', { align: 'left' })
    .fontSize(10)
    .text('123 Tech Park, Bengaluru, Karnataka')
    .text('GSTIN: 29AAAAA0000A1Z5')
    .moveDown();

  doc.text('--------------------------------------------------------------------------------');

  // --- 3. Guest & Property Info ---
  doc
    .fontSize(12)
    .text('Bill To:', { underline: true })
    .fontSize(10)
    .text(`Guest: ${invoiceData.guest.name}`)
    .text(`Property: ${invoiceData.property.title}`)
    .text(`Address: ${invoiceData.property.address}`)
    .moveDown();

  // --- 4. Table Header ---
  const tableTop = 250;
  doc
    .fontSize(10)
    .text('Description', 50, tableTop)
    .text('Amount (INR)', 400, tableTop, { align: 'right' });

  doc.text('--------------------------------------------------------------------------------', 50, tableTop + 15);

  // --- 5. Line Items ---
  const itemHeight = tableTop + 35;
  doc
    .text('Base Accommodation Fee', 50, itemHeight)
    .text(`₹${invoiceData.baseAmount.toLocaleString('en-IN')}`, 400, itemHeight, { align: 'right' });

  doc
    .text('Service Fee', 50, itemHeight + 20)
    .text(`₹${invoiceData.serviceFee.toLocaleString('en-IN')}`, 400, itemHeight + 20, { align: 'right' });

  doc
    .text('GST (18%)', 50, itemHeight + 40)
    .text(`₹${invoiceData.gstAmount.toLocaleString('en-IN')}`, 400, itemHeight + 40, { align: 'right' });

  // --- 6. Total ---
  doc
    .fontSize(12)
    .text('Total Amount Paid:', 300, itemHeight + 70)
    .text(`₹${invoiceData.totalAmount.toLocaleString('en-IN')}`, 400, itemHeight + 70, { align: 'right', bold: true });

  // --- 7. Footer ---
  doc
    .fontSize(10)
    .text('Thank you for choosing Airbnb Clone!', 50, 700, { align: 'center', color: 'grey' });

  doc.end();
};

module.exports = generateInvoicePDF;