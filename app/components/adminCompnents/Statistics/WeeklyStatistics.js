'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeeklyStatistics({ data }) {
  return (
    <div className="mx-auto p-4 md:p-[20px_30px_20px_30px] bg-white rounded-lg relative max-w-full md:max-w-4xl">
      <h3 className="text-left p-4 md:p-5 mb-6 md:mb-10 border-b text-lg md:text-[22px] font-bold">
        Weekly Statistics
      </h3>
      <div className='ml-[-35px]'>
      <ResponsiveContainer width="100%" height={300} minHeight={320} >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Score" fill="#5B8DD7" radius={[10, 10, 0, 0]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
