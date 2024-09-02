'use client';
import React from 'react';

export default function WeeklyProgress({ progress }) {
  return (
    <div style={{ padding: '20px', background: "#fff", borderRadius:"10px" }}>
      <h3 className='md:text-left text-center mb-5  text-[16px] font-[700] md:leading-[21.82px]'>Weekly Progress</h3>
      <div className="progress-bar flex flex-row items-center gap-5">
        <div className="progress" style={{ width: `${progress}%`, height: '10px', background: '#5B8DD7', borderRadius: '5px' }}></div>
        <span className='text-[#5C5C5C] font-[700] leading-[21.82px]'>{progress}%</span>
      </div>
    </div>
  );
}
