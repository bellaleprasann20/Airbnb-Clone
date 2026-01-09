import React from 'react';
import { IndianRupee, Info } from 'lucide-react';

const PriceBreakdown = ({ 
  pricePerNight, 
  nights, 
  serviceFeeRate = 0.05, 
  gstRate = 0.18 
}) => {
  // Logic calculations
  const baseTotal = pricePerNight * nights;
  const serviceFee = Math.round(baseTotal * serviceFeeRate);
  const totalBeforeTax = baseTotal + serviceFee;
  const gstAmount = Math.round(totalBeforeTax * gstRate);
  const finalTotal = totalBeforeTax + gstAmount;

  const Row = ({ label, value, isBold = false, showInfo = false }) => (
    <div className={`flex justify-between items-center ${isBold ? 'text-gray-900 font-bold text-lg pt-4 border-t mt-4' : 'text-gray-600'}`}>
      <div className="flex items-center gap-1 underline underline-offset-4 decoration-gray-300">
        <span>{label}</span>
        {showInfo && <Info size={14} className="text-gray-400 cursor-help" />}
      </div>
      <div className="flex items-center">
        <IndianRupee size={isBold ? 18 : 14} />
        <span>{value.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3">
      <p className="text-center text-sm text-gray-500 mb-6 font-light italic">
        You won't be charged yet
      </p>

      {/* Nightly Calc */}
      <Row 
        label={`₹${pricePerNight.toLocaleString('en-IN')} x ${nights} nights`} 
        value={baseTotal} 
      />

      {/* Service Fee */}
      <Row 
        label="Airbnb service fee" 
        value={serviceFee} 
        showInfo={true} 
      />

      {/* GST */}
      <Row 
        label="Taxes (GST 18%)" 
        value={gstAmount} 
      />

      {/* Total */}
      <Row 
        label="Total (INR)" 
        value={finalTotal} 
        isBold={true} 
      />
      
      <div className="bg-gray-50 p-3 rounded-lg mt-6 border border-dashed border-gray-300">
        <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-wider font-semibold">
          Note: This booking is subject to the host's cancellation policy. 
          Prices include 18% GST as per Indian Tax Laws.
        </p>
      </div>
    </div>
  );
};

export default PriceBreakdown;