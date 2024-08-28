// src/app/components/AdminClientPage.js
'use client';

import SideBar from "../sidebar/sideBar";
import React, { useState } from 'react';

import Topbar from "../topbar/topbar";
import WeeklyStatistics from '../Statistics/WeeklyStatistics';
import FilterByDate from '../Statistics/FilterByDate';
import WeeklyProgress from './WeeklyProgress';


export default function AdminClientPage({ session }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);

    // Function to handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Fetch new data based on selected date and update the state
    };
    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col w-full">
                <Topbar />
                <div>
                <div >
                    <WeeklyStatistics data={weeklyData} />
                </div>
                <div>
                    <FilterByDate onDateChange={handleDateChange} />

                    <WeeklyProgress progress={82} />
                </div>
            </div>
            </div>
           
        </div>
    );
}
