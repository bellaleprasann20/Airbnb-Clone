import React from 'react';
import { format } from 'date-fns';
import Button from '../common/Button';
import { IndianRupee } from 'lucide-react';

const BookingSummary = ({ 
  property, 
  startDate, 
  endDate, 
  guests, 
  onBookNow, 
  isLoading 
}) => {
  // 1. Calculate Nights
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const basePrice = property.pricePerNight * nights;
  const serviceFee = Math.round(basePrice * 0.05); // 5% Service Fee
  const gstAmount = Math.round((basePrice + serviceFee) * 0.18); // 18% GST
  const totalAmount = basePrice + serviceFee + gstAmount;

  return (
    <div className="border rounded-xl p-6 shadow-xl bg-white sticky top-28">
      {/* Price Header */}
      <div className="flex justify-between items-baseline mb-4">
        <div className="text-2xl font-bold flex items-center">
          <IndianRupee size={20} /> {property.pricePerNight.toLocaleString('en-IN')}
          <span className="text-base font-normal text-gray-500 ml-1"> / night</span>
        </div>
      </div>

      {/* Date and Guest Display */}
      <div className="border rounded-lg mb-4">
        <div className="grid grid-cols-2 border-b">
          <div className="p-3 border-r">
            <label className="block text-[10px] font-bold uppercase">Check-in</label>
            <div className="text-sm">{startDate ? format(startDate, 'dd/MM/yyyy') : 'Add date'}</div>
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase">Checkout</label>
            <div className="text-sm">{endDate ? format(endDate, 'dd/MM/yyyy') : 'Add date'}</div>
          </div>
        </div>
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase">Guests</label>
          <div className="text-sm">{guests} {guests > 1 ? 'guests' : 'guest'}</div>
        </div>
      </div>

      {/* Booking Button */}
      <Button 
        variant="primary" 
        className="w-full py-3 mb-4" 
        onClick={onBookNow}
        isLoading={isLoading}
        disabled={!startDate || !endDate}
      >
        {startDate && endDate ? 'Reserve' : 'Check availability'}
      </Button>

      {/* Price Breakdown (Only visible if dates are selected) */}
      {nights > 0 && (
        <div className="space-y-3 mt-4 text-gray-600">
          <p className="text-center text-sm mb-4">You won't be charged yet</p>
          
          <div className="flex justify-between">
            <span className="underline italic">
              ₹{property.pricePerNight.toLocaleString('en-IN')} x {nights} nights
            </span>
            <span>₹{basePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between">
            <span className="underline">Airbnb service fee (5%)</span>
            <span>₹{serviceFee.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between pb-4 border-b">
            <span className="underline">Taxes (GST 18%)</span>
            <span>₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-gray-900 font-bold text-lg mt-4">
            <span>Total (Incl. taxes)</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;