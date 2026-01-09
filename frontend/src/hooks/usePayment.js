import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Initialize Razorpay Payment
   * @param {Object} bookingDetails - Includes amount, bookingId, and user info
   */
  const processRazorpayPayment = async (bookingDetails) => {
    setIsProcessing(true);

    try {
      // 1. Create an order on your backend
      const { data: order } = await api.post('/payments/create-order', {
        amount: bookingDetails.totalAmount,
        bookingId: bookingDetails.bookingId,
      });

      // 2. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Public Key
        amount: order.amount,
        currency: "INR",
        name: "Airbnb Clone",
        description: `Booking for ${bookingDetails.propertyName}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment on backend after success
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingDetails.bookingId
            });

            if (verifyRes.data.success) {
              toast.success("Payment Successful! Your trip is booked.");
              window.location.href = `/receipt/${bookingDetails.bookingId}`;
            }
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: bookingDetails.userName,
          email: bookingDetails.userEmail,
        },
        theme: {
          color: "#FF385C", // Airbnb Rose
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Could not initialize payment gateway.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processRazorpayPayment,
    isProcessing
  };
};