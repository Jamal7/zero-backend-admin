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
    <div style={{ padding: '20px', background: "#fff", borderRadius:"10px",}}>
      <h3 className='text-center font-[700] text-[22px] leading-[21px] pb-5 mt-5 '>Filter By Date</h3>
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
