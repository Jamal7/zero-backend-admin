"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const AppRevenueStats = () => {
    const data = {
        labels: ['App Payments', 'Job (Individual)', 'Membership Package'],
        datasets: [
            {
                data: [54, 30, 26],
                backgroundColor: ['#6F9BDC', '#5BC8D7', '#D75B5B'],
                hoverBackgroundColor: ['#357ABD', '#3AC0A3', '#D75B5B'],
            },
        ],
    };

    const options = {
        cutout: '60%', // Thicker donut
        plugins: {
            legend: {
                display: false, // Disable default legend
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                },
            },
            datalabels: {
                color: function (context) {
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                backgroundColor: '#fff',
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                padding: { top: 12, bottom: 12, left: 8, right: 8 },
                font: {
                    weight: 'bold',
                    size: 10,
                },
                formatter: (value) => `${value}%`,
                align: 'end',
                anchor: 'end',
                offset: -10,
                clip: false,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowBlur: 5,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0,
                left: 20,
                right: 40, // Increased right padding to prevent clipping
            },
        },
    };

    return (
        <div className="bg-white rounded-xl flex flex-col items-center py-5">
            <h1 className="text-[22px] font-[700] text-center mb-5">App Revenue Stats</h1>
            <div className="relative w-full max-w-[350px] md:pl-16 pl-8"> {/* Adjusted padding for smaller screens */}
                <Doughnut data={data} options={options} />
            </div>
            <div className="flex flex-col items-left px-5 md:px-10"> {/* Adjusted padding for smaller screens */}
                {data.labels.map((label, index) => (
                    <div key={index} className="flex items-center mb-0">
                        <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                        ></div>
                        <span className="text-[#7C828A] text-[16px] font-[400]">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppRevenueStats;
