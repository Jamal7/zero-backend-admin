'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', Income: 10, Users: 20 },
  { name: 'Feb', Income: 15, Users: 18 },
  { name: 'Mar', Income: 20, Users: 22 },
  { name: 'Apr', Income: 8, Users: 10 },
  { name: 'May', Income: 12, Users: 15 },
  { name: 'Jun', Income: 18, Users: 25 },
  { name: 'Jul', Income: 25, Users: 30 },
  { name: 'Aug', Income: 10, Users: 15 },
  { name: 'Sep', Income: 22, Users: 27 },
  { name: 'Oct', Income: 18, Users: 20 },
  { name: 'Nov', Income: 24, Users: 28 },
  { name: 'Dec', Income: 20, Users: 25 },
];

const renderCustomLegend = (props) => {
  const { payload } = props;

  return (
    <ul className="flex justify-end gap-5 list-none p-0 m-0">
      {payload.map((entry, index) => {
        const isIncome = entry.value === 'Income';
        return (
          <li
            key={`item-${index}`}
            className={`flex items-center ${isIncome ? 'text-[#3D415C]' : 'text-[#5A5E7C]'}`}
          >
            <svg width="12" height="12" className="mr-1.5">
              <circle cx="6" cy="6" r="6" fill={entry.color} />
            </svg>
            {entry.value}
          </li>
        );
      })}
    </ul>
  );
};

const CustomGrid = (props) => {
  const { x, y, width, height, horizontalPoints, verticalPoints } = props;

  return (
    <g>
      {horizontalPoints.map((point, index) =>
        point !== 0 ? (
          <line
            key={`hline-${index}`}
            x1={x}
            x2={x + width}
            y1={point}
            y2={point}
            stroke="#e0e0e0"
            strokeDasharray="4 4"
          />
        ) : null
      )}
      {verticalPoints.map((point, index) => (
        <line
          key={`vline-${index}`}
          x1={point}
          x2={point}
          y1={y}
          y2={y + height}
          stroke="#e0e0e0"
          strokeDasharray="4 4"
        />
      ))}
    </g>
  );
};

export default function BarCharts() {
  return (
    <div className="p-10 bg-white rounded-lg relative">
      <h3 className="text-center md:text-left pb-5 ml-10 mb-10 border-b text-sm font-semibold leading-6">
        Acquisition number change per month in 2020 years
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} content={<CustomGrid />} />
          <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: 'transparent' }} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend
            content={renderCustomLegend}
            wrapperStyle={{
              position: 'absolute',
              top: -86,
              right: 6,
            }}
            className="absolute md:-top-[86px] md:right-[6px] -top-[100px] right-14 "
          />
          <Bar dataKey="Income" fill="#5B8DD7" radius={[10, 10, 10, 10]} barSize={5} />
          <Bar dataKey="Users" fill="#ADC6EB" radius={[10, 10, 10, 10]} barSize={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
