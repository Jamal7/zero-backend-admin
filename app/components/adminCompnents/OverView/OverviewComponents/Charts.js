'use client'
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

const CircularProgressBar = ({ percentage }) => {
  const radius = 50;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3498db"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference * 0.58}, ${circumference * 0.42}`} // 58% filled, 42% dashed
        strokeDashoffset={0}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`} // Starts from the top
        style={{
          strokeLinecap: 'butt', // Slice effect at the end
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <circle
        stroke="#3498db"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`2 2`} // Dashed lines for the remaining 42%
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(${360 * 0.58 - 90} ${radius} ${radius})`} // Starts after the filled part
        style={{
          strokeLinecap: 'butt',
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fill="#333"
        fontSize="20px"
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default function Charts() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Circular Progress Bars */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgressBar percentage={58} />
          <div style={{ marginLeft: '10px', textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal' }}>Total Number<br />App Downloads</h4>
            <span style={{ color: 'red', fontSize: '14px' }}>10% ↓</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <h3 style={{ textAlign: 'center' }}>Acquisition number change per month in 2020 years</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#3498db" />
          <Bar dataKey="Users" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
