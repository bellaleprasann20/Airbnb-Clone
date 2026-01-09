import { TAX_RATE, SERVICE_FEE_RATE } from './constants';

/**
 * Formats a number into Indian Rupee (INR) currency format
 * e.g., 50000 -> ₹50,000
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculates the total breakdown for a booking
 */
export const calculateBookingTotal = (pricePerNight, nights) => {
  const basePrice = pricePerNight * nights;
  const serviceFee = Math.round(basePrice * SERVICE_FEE_RATE);
  const gst = Math.round((basePrice + serviceFee) * TAX_RATE);
  const total = basePrice + serviceFee + gst;

  return {
    basePrice,
    serviceFee,
    gst,
    total
  };
};