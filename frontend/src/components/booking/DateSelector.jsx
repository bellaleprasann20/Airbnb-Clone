import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from 'lucide-react';
import './DateSelector.css'; // For custom Airbnb-style overrides

const DateSelector = ({ startDate, endDate, onChange, disabledDates = [] }) => {
  
  // Handle date change from the picker
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    onChange(start, end);
  };

  return (
    <div className="w-full relative date-selector-container">
      <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
        <CalendarIcon size={18} className="text-[#FF385C]" />
        <span>Select Dates</span>
      </div>

      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={new Date()} // Prevent booking in the past
        excludeDates={disabledDates.map(date => new Date(date))} // Block already booked dates
        monthsShown={2} // Professional dual-pane view
        monthsToScroll={1}
        dayClassName={(date) => 
          date.getTime() === startDate?.getTime() || date.getTime() === endDate?.getTime()
          ? "bg-[#FF385C] text-white rounded-full"
          : "hover:bg-gray-100 rounded-full"
        }
      />
      
      <div className="mt-4 flex justify-between text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF385C] rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;