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
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
      {payload.map((entry, index) => {
        const isIncome = entry.value === 'Income';
        return (
          <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', color: isIncome ? '#3D415C' : '#5A5E7C' }}>
            <svg width="12" height="12" style={{ marginRight: 5 }}>
              <circle cx="6" cy="6" r="6" fill={entry.color} />
            </svg>
            {entry.value}
          </li>
        );
      })}
    </ul>
  );
};

export default function BarCharts() {
  return (
    <div style={{ padding: '40px 50px 100px 0px', background: "#fff", borderRadius:"10px", position: 'relative' }}>
      <ResponsiveContainer width="100%" height={300}>
        <h3 className='text-left pb-5 ml-10 mb-10 border-b text-[14px] font-[600] leading-[24px]'>Acquisition number change per month in 2020 years</h3>

        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} /> {/* Dashed line */}
          <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: 'transparent' }} />
          <YAxis tickLine={false} axisLine={{ stroke: 'transparent' }} />
          <Tooltip />
          <Legend 
            content={renderCustomLegend}
            wrapperStyle={{
              position: 'absolute',
              top: -86,
              right: 6,
            }}
          />
          <Bar dataKey="Income" fill="#5B8DD7" radius={[10, 10, 10, 10]} barSize={5} />
          <Bar dataKey="Users" fill="#ADC6EB" radius={[10, 10, 10, 10]} barSize={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
