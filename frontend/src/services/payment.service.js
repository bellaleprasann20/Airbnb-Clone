import api from './api';

export const paymentService = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  
  verifyPayment: (paymentDetails) => api.post('/payments/verify', paymentDetails),
  
  getPayouts: () => api.get('/host/payout-history')
};