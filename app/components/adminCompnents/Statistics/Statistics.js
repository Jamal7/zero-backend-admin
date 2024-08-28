"Use Client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sideBar';
import Topbar from '../topbar/topbar';
import WeeklyStatistics from './WeeklyStatistics';
import WeeklyProgress from './WeeklyProgress';
import FilterByDate from './FilterByDate'

export default function AdminClientPage({ session }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [progress, setProgress] = useState(82);

    useEffect(() => {
        // Set default data on mount or fetch data from an API
        setWeeklyData([
            { name: 'Monday', Score: 40 },
            { name: 'Tuesday', Score: 50 },
            { name: 'Wednesday', Score: 20 },
            { name: 'Thursday', Score: 60 },
            { name: 'Friday', Score: 45 },
            { name: 'Saturday', Score: 50 },
            { name: 'Sunday', Score: 30 },
        ]);
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Fetch new data based on selected date and update the state
        setWeeklyData([
            { name: 'Monday', Score: 50 },
            { name: 'Tuesday', Score: 40 },
            { name: 'Wednesday', Score: 70 },
            { name: 'Thursday', Score: 80 },
            { name: 'Friday', Score: 60 },
            { name: 'Saturday', Score: 50 },
            { name: 'Sunday', Score: 45 },
        ]);
        setProgress(75);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Topbar />
                <div className="flex flex-row py-10 px-5 gap-5">
                    <div className="w-[70%]">
                        <WeeklyStatistics data={weeklyData} />
                    </div>
                    <div className="flex flex-col w-[30%] gap-5">
                        <FilterByDate onDateChange={handleDateChange} />
                        <WeeklyProgress progress={progress} />
                    </div>
                </div>
            </div>
        </div>
    );
}
