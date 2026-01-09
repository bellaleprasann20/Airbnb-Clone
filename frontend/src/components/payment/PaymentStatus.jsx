import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Calendar, MapPin, ReceiptText, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const PaymentStatus = ({ status = 'success', bookingDetails }) => {
  const navigate = useNavigate();

  const isSuccess = status === 'success';

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white border rounded-3xl shadow-sm text-center">
      {/* Icon Section */}
      <div className="flex justify-center mb-6">
        {isSuccess ? (
          <div className="bg-green-50 p-4 rounded-full animate-in zoom-in duration-500">
            <CheckCircle2 size={80} className="text-green-500" />
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-full animate-in zoom-in duration-500">
            <XCircle size={80} className="text-red-500" />
          </div>
        )}
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isSuccess ? 'Booking Confirmed!' : 'Payment Failed'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isSuccess 
          ? `Pack your bags! Your stay at ${bookingDetails?.propertyTitle} is all set.`
          : 'Something went wrong with the transaction. Please check your bank details and try again.'}
      </p>

      {/* Success Details Card */}
      {isSuccess && bookingDetails && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Reservation Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400" />
              <p className="text-sm font-medium">{bookingDetails.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <p className="text-sm font-medium">
                {bookingDetails.checkIn} — {bookingDetails.checkOut}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ReceiptText size={18} className="text-gray-400" />
              <p className="text-sm font-medium">Order ID: {bookingDetails.orderId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isSuccess ? (
          <>
            <Button variant="dark" onClick={() => navigate('/guest/trips')}>
              View My Trips
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Explore More
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </>
        )}
      </div>

      {isSuccess && (
        <p className="mt-8 text-xs text-gray-400 flex items-center justify-center gap-1 cursor-pointer hover:text-gray-600 transition-colors">
          Download PDF Receipt <ArrowRight size={12} />
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;