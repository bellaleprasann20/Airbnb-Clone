import { format, differenceInDays } from 'date-fns';

/**
 * Formats a date to "Jan 12, 2026"
 */
export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
};

/**
 * Formats a date range to "Jan 12 – 15"
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If in the same month: "Jan 12 – 15"
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "MMM d")} – ${format(end, "d")}`;
  }
  
  // If across months: "Jan 28 – Feb 2"
  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
};

/**
 * Calculates number of nights between two dates
 */
export const calculateNights = (startDate, endDate) => {
  return differenceInDays(new Date(endDate), new Date(startDate));
};