import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/booking.service';
import { calculateBookingTotal } from '../utils/priceCalc';
import { toast } from 'react-hot-toast';

export const useBooking = (property) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // 1. Calculate pricing breakdown dynamically
  const getPricing = useCallback(() => {
    if (!startDate || !endDate || !property) return null;
    
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    return {
      nights,
      ...calculateBookingTotal(property.pricePerNight, nights)
    };
  }, [startDate, endDate, property]);

  // 2. Handle the reservation request
  const reserve = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    try {
      const pricing = getPricing();
      const bookingData = {
        propertyId: property._id,
        startDate,
        endDate,
        totalPrice: pricing.total,
        guests
      };

      const response = await bookingService.createBooking(bookingData);
      toast.success('Reservation successful!');
      navigate(`/receipt/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book property');
    } finally {
      setLoading(false);
    }
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    loading,
    pricing: getPricing(),
    reserve
  };
};