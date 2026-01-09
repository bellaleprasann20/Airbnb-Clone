const express = require('express');
const router = express.Router();

// 1. Double check these names match the exports in your controller
const {
  createBooking,
  verifyPayment, // <--- This was likely missing or misspelled
  getMyBookings,
  getHostReservations,
  cancelBooking
} = require('../controllers/booking.controller');

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(protect);

router.post('/', authorize('guest'), createBooking);
router.post('/verify', authorize('guest'), verifyPayment); // <--- Step 2
router.get('/my-bookings', authorize('guest'), getMyBookings);
router.get('/host-reservations', authorize('host'), getHostReservations);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;