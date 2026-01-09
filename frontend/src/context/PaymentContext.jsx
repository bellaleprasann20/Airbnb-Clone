import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | processing | success | failed
  const [transactionDetails, setTransactionDetails] = useState(null);

  // 1. Initialize Order (Backend Handshake)
  const createOrder = async (bookingId, amount) => {
    setPaymentStatus('processing');
    try {
      const { data } = await api.post('/payments/create-order', {
        bookingId,
        amount, // In INR
      });
      return data; // Returns Razorpay Order ID and details
    } catch (error) {
      setPaymentStatus('failed');
      throw error;
    }
  };

  // 2. Verify Payment (Signature Verification)
  const verifyPayment = async (paymentResponse) => {
    try {
      const { data } = await api.post('/payments/verify', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (data.success) {
        setPaymentStatus('success');
        setTransactionDetails(data.booking);
        return true;
      } else {
        setPaymentStatus('failed');
        return false;
      }
    } catch (error) {
      setPaymentStatus('failed');
      return false;
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setTransactionDetails(null);
  };

  return (
    <PaymentContext.Provider value={{ 
      paymentStatus, 
      transactionDetails, 
      createOrder, 
      verifyPayment, 
      resetPayment 
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);