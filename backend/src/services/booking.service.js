const Booking = require('../models/Booking.model');
const User = require('../models/User.model');

exports.createBooking = async (bookingData) => {
  // --- ADDED: PREVENT DOUBLE BOOKING ---
  const existingBooking = await Booking.findOne({
    property: bookingData.property,
    status: 'confirmed',
    $or: [
      { checkIn: { $lt: bookingData.checkOut }, checkOut: { $gt: bookingData.checkIn } }
    ]
  });

  if (existingBooking) {
    throw new Error('These dates are already booked by someone else!');
  }

  // 1. Create the booking record
  const booking = await Booking.create(bookingData);

  // 2. LINK TO USER
  await User.findByIdAndUpdate(bookingData.guest, {
    $push: { bookings: booking._id }
  });

  return booking;
};

exports.getBookingsByUser = async (userId, status) => {
  let query = { guest: userId };
  const now = new Date();

  if (status === 'upcoming') {
    query.checkIn = { $gte: now };
    query.status = { $ne: 'cancelled' };
  } else if (status === 'past') {
    query.checkIn = { $lt: now };
  }

  // Populating property ensures images and titles appear in "My Trips"
  return await Booking.find(query)
    .populate({
      path: 'property',
      select: 'title location images price' 
    })
    .sort({ checkIn: 1 });
};

exports.cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, guest: userId },
    { status: 'cancelled' },
    { new: true }
  );
  
  if (!booking) throw new Error('Booking not found or unauthorized');
  
  return booking;
};