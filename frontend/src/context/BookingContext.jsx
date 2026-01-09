import { createContext, useState, useContext, useMemo } from 'react';
import { differenceInDays } from 'date-fns';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({
    propertyId: null,
    startDate: null,
    endDate: null,
    guests: 1,
    pricePerNight: 0,
    basePrice: 0,
    serviceFee: 0,
    totalPrice: 0,
  });

  // Calculate nights and fees whenever dates or price changes
  const updateBooking = (property, start, end, guests = 1) => {
    let nights = 0;
    if (start && end) {
      nights = differenceInDays(new Date(end), new Date(start));
    }

    const basePrice = nights * property.pricePerNight;
    const serviceFee = Math.round(basePrice * 0.05); // 5% Service Fee
    const gst = Math.round((basePrice + serviceFee) * 0.18); // 18% GST

    setBookingDetails({
      propertyId: property._id,
      propertyTitle: property.title,
      location: property.location,
      startDate: start,
      endDate: end,
      nights,
      guests,
      pricePerNight: property.pricePerNight,
      basePrice,
      serviceFee,
      gst,
      totalPrice: basePrice + serviceFee + gst,
    });
  };

  const clearBooking = () => {
    setBookingDetails({
      propertyId: null,
      startDate: null,
      endDate: null,
      guests: 1,
      totalPrice: 0,
    });
  };

  return (
    <BookingContext.Provider value={{ bookingDetails, updateBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);