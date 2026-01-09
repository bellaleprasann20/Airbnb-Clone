import React, { useState } from 'react';
import { IndianRupee, ShieldCheck, Lock } from 'lucide-react';
import Button from '../common/Button';
import api from '../../services/api';

const PaymentForm = ({ bookingData, property, totalAmount, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Function to load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Main Payment Handler
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Step A: Load script
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // Step B: Create Order on your Backend
      const { data } = await api.post('/payments/initiate', {
        bookingId: bookingData._id,
        amount: totalAmount, // Backend handles conversion to Paise
      });

      // Step C: Razorpay Checkout Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Airbnb Clone',
        description: `Booking for ${property.title}`,
        order_id: data.orderId,
        handler: async function (response) {
          // Verify payment on backend
          const verifyRes = await api.post('/payments/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            onSuccess(verifyRes.data.booking);
          }
        },
        prefill: {
          name: bookingData.userName,
          email: bookingData.userEmail,
        },
        theme: {
          color: '#FF385C', // Airbnb Rose
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
      
      {/* Visual representation of payment options */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-xl bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded border">
              <IndianRupee size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="font-bold">Razorpay Secure</p>
              <p className="text-xs text-gray-500">UPI, Cards, Netbanking</p>
            </div>
          </div>
          <div className="h-4 w-4 rounded-full border-4 border-black"></div>
        </div>
      </div>

      {/* Safety Info */}
      <div className="flex gap-3 p-4 bg-gray-50 rounded-xl mb-6">
        <ShieldCheck className="text-green-600 shrink-0" />
        <p className="text-xs text-gray-600">
          <strong>Safe & Secure Payments.</strong> Your payment details are encrypted 
          and processed securely via Razorpay.
        </p>
      </div>

      {/* Action Button */}
      <Button 
        variant="primary" 
        fullWidth 
        className="py-4 text-lg"
        onClick={handlePayment}
        isLoading={isProcessing}
      >
        <Lock size={18} className="mr-2" />
        Pay ₹{totalAmount.toLocaleString('en-IN')}
      </Button>
      
      <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
        100% Secure Transaction
      </p>
    </div>
  );
};

export default PaymentForm;