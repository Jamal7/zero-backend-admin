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

export default function BarCharts() {
  return (

    <div style={{ padding: '20px', background: "#fff", margin: "50px 0px 50px 0px", borderRadius:"10px" }}>
      <h3 style={{ textAlign: 'center' }}>Acquisition number change per month in 2020 years</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#5B8DD7" radius={[10, 10, 0, 0]} barSize={5} />
          <Bar dataKey="Users" fill="#ADC6EB" radius={[10, 10, 0, 0]} barSize={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>


  );
};
