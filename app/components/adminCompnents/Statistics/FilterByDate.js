'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './FilterByDate.css'; // Custom styles to match the design

export default function FilterByDate({ onDateChange }) {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h3 className="text-center font-bold text-lg md:text-[22px] leading-[24px] pb-4 mt-4 md:mt-5">
        Filter By Date
      </h3>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="custom-calendar"
        />
      </div>
    </div>
  );
}
