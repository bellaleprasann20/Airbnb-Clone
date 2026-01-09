import api from './api';

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  getGuestTrips: (status) => api.get('/guest/trips', { params: { status } }),
  
  getHostReservations: () => api.get('/host/reservations'),
  
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`)
};