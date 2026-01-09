import React from 'react';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import Button from './Button'; // Your fixed Button component

const PaymentSuccess = ({ dates, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Your stay is officially confirmed.</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-[#FF385C]" size={20} />
            <span className="font-medium">{dates} Nights Reserved</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-[#FF385C]" size={20} />
            <span className="font-medium">Booking ID: #RZP_{Math.floor(Math.random() * 10000)}</span>
          </div>
        </div>

        <Button fullWidth onClick={onClose} variant="primary">
          View My Bookings
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;