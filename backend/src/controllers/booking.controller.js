const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User.model');
const Booking = require('../models/Booking.model');
const Property = require('../models/Property.model');

// Initialize Razorpay with error checking
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Booking / Razorpay Order
exports.createBooking = async (req, res, next) => {
  try {
    const { propertyId, checkIn, checkOut, guests, totalPrice } = req.body;

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total price" });
    }

    // Razorpay expects amount in PAISE (Integer)
    const amountInPaise = Math.round(Number(totalPrice) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    // Step A: Create Razorpay Order
    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.error("Razorpay Order Error:", rzpErr);
      return res.status(500).json({ 
        success: false, 
        message: "Razorpay initialization failed. Check your Test Keys.",
        error: rzpErr.description 
      });
    }

    // Step B: Create Pending Booking in DB
    const booking = await Booking.create({
      guest: req.user.id,
      property: propertyId,
      checkIn,
      checkOut,
      numberOfGuests: guests || 1,
      totalPrice: Number(totalPrice),
      currency: 'INR',
      paymentMethod: 'razorpay',
      gatewayOrderId: order.id,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Link booking to User
    await User.findByIdAndUpdate(req.user.id, { $push: { bookings: booking._id } });

    res.status(201).json({ 
      success: true, 
      order, 
      booking 
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    next(error);
  }
};

// 2. Verify Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const updatedBooking = await Booking.findOneAndUpdate(
        { gatewayOrderId: razorpay_order_id },
        { 
          status: 'confirmed', 
          paymentStatus: 'paid'
        },
        { new: true }
      );

      res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully", 
        data: updatedBooking 
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    next(error);
  }
};

// 3. Get My Bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query; 
    const today = new Date();
    
    let filter = { 
      guest: req.user.id,
      paymentStatus: 'paid' 
    };

    if (status === 'upcoming') {
      filter.checkIn = { $gte: today };
      filter.status = 'confirmed';
    } else if (status === 'past') {
      filter.checkIn = { $lt: today };
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: 'property',
        select: 'title images city country price'
      })
      .sort(status === 'upcoming' ? { checkIn: 1 } : { checkIn: -1 });

    res.status(200).json({ 
      success: true, 
      count: bookings.length, 
      data: bookings 
    });
  } catch (error) {
    next(error);
  }
};

// 4. Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.guest.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (error) {
    next(error);
  }
};

// 5. Host Reservations
exports.getHostReservations = async (req, res, next) => {
  try {
    const hostProperties = await Property.find({ host: req.user.id }).select('_id');
    const propertyIds = hostProperties.map(p => p._id);

    const reservations = await Booking.find({
      property: { $in: propertyIds },
      status: 'confirmed'
    })
    .populate('property', 'title images')
    .populate('guest', 'name email')
    .sort({ checkIn: 1 });

    res.status(200).json({ 
      success: true, 
      count: reservations.length, 
      data: reservations 
    });
  } catch (error) {
    next(error);
  }
};