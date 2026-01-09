import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Download, Share2, ShieldCheck, Mail } from 'lucide-react';
import Button from '../../components/common/Button';

const Receipt = () => {
  const { bookingId } = useParams();
  const receiptRef = useRef();

  // Mock data - In production, fetch this using bookingId
  const receiptData = {
    orderId: `RZP_${bookingId?.slice(-8).toUpperCase() || 'TXN7721'}`,
    date: "December 29, 2025",
    status: "Paid",
    guestName: "Arjun Sharma",
    propertyTitle: "Luxury Alpine Villa",
    hostName: "Rajesh K.",
    location: "Manali, Himachal Pradesh",
    checkIn: "Jan 12, 2026",
    checkOut: "Jan 15, 2026",
    nights: 3,
    pricing: {
      base: 24000,
      serviceFee: 1200,
      gst: 4536,
      total: 29736
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Actions Bar - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-2xl font-bold">Receipt</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <Printer size={16} /> Print
            </Button>
            <Button variant="dark" size="sm" className="flex items-center gap-2">
              <Download size={16} /> PDF
            </Button>
          </div>
        </div>

        {/* The Actual Receipt Card */}
        <div 
          ref={receiptRef}
          className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm print:border-0 print:shadow-none"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#FF385C]">airbnb</h2>
              <p className="text-gray-500 font-medium">Receipt ID: {receiptData.orderId}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {receiptData.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">{receiptData.date}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold text-gray-400">Guest Information</h4>
              <p className="font-semibold text-lg">{receiptData.guestName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck size={16} className="text-green-600" /> Identity Verified
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold text-gray-400">Accommodation</h4>
              <p className="font-semibold text-lg">{receiptData.propertyTitle}</p>
              <p className="text-sm text-gray-500">{receiptData.location}</p>
              <p className="text-sm text-gray-600 font-medium">
                {receiptData.checkIn} — {receiptData.checkOut} ({receiptData.nights} nights)
              </p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">₹{receiptData.pricing.base / receiptData.nights} x {receiptData.nights} nights</span>
              <span className="font-medium">₹{receiptData.pricing.base.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Airbnb Service Fee</span>
              <span className="font-medium">₹{receiptData.pricing.serviceFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-4">
              <span className="text-gray-600">Occupancy Taxes (GST 18%)</span>
              <span className="font-medium">₹{receiptData.pricing.gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-lg font-bold text-gray-900">Total (INR)</span>
              <span className="text-lg font-bold text-gray-900">₹{receiptData.pricing.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t text-center space-y-4">
            <p className="text-xs text-gray-400 px-6 italic">
              Payment handled securely via Razorpay. This is a computer-generated receipt and does not require a physical signature.
            </p>
            <div className="flex justify-center gap-6">
               <button className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition-colors">
                  <Share2 size={12} /> Share Receipt
               </button>
               <button className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition-colors">
                  <Mail size={12} /> Email to self
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;