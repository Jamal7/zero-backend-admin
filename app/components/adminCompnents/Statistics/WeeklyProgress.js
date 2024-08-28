'use client';
import React from 'react';

export default function WeeklyProgress() {
  return (
    <div style={{ padding: '20px', background: "#fff", borderRadius:"10px" }}>
      <h3 className='text-left pb-5 mb-10 border-b'>Weekly Progress</h3>
      <div className="progress-bar">
        <div className="progress" style={{ width: '82%', height: '10px', background: '#5B8DD7', borderRadius: '5px' }}></div>
        <span>82%</span>
      </div>
    </div>
  );
}
