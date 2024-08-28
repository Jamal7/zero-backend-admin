'use client';
import React, { useState } from 'react';
import WeeklyStatistics from './WeeklyStatistics';
import FilterByDate from './FilterByDate';
import WeeklyProgress from './WeeklyProgress';

const data = [
  { name: 'Monday', Score: 40 },
  { name: 'Tuesday', Score: 50 },
  { name: 'Wednesday', Score: 20 },
  { name: 'Thursday', Score: 60 },
  { name: 'Friday', Score: 45 },
  { name: 'Saturday', Score: 50 },
  { name: 'Sunday', Score: 30 },
];

export default function AdminClientPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState(data);
  const [progress, setProgress] = useState(82);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);

    // Update the data and progress based on the selected date
    // Here you would add logic to fetch or calculate new data and progress
    // For example:
    const newData = data; // Update this based on your logic
    const newProgress = 82; // Update this based on your logic

    setWeeklyData(newData);
    setProgress(newProgress);
  };

  return (
    <div className="admin-client-page">
      <FilterByDate onDateChange={handleDateChange} />
      <WeeklyStatistics data={weeklyData} />
      <WeeklyProgress progress={progress} />
    </div>
  );
}
