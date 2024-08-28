'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeeklyStatistics({ data }) {
  return (
    <div style={{ padding: '20px 60px 20px 20px', background: "#fff", borderRadius:"10px", position: 'relative' }}>
      <h3 className='text-left p-5 mb-10 border-b'>Weekly Statistics</h3>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Score" fill="#5B8DD7" radius={[10, 10, 0, 0]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
