'use client';
import React from 'react';

const GradientChart = () => {
  return (
    <div className="relative h-10 w-full overflow-hidden rounded-lg  bg-white">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        {/* Define the gradient */}
        <defs>
          <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" /> {/* Tailwind green-300 */}
            <stop offset="100%" stopColor="#d1fae5" stopOpacity="0" /> {/* Tailwind green-100 */}
          </linearGradient>
        </defs>

        {/* Draw the polygon with adjusted points */}
        <polygon
          fill="url(#gradientFill)"
          points="0,100 20,70 30,80 40,50 60,75 80,60 100,85 120,50 140,70 160,40 180,60 200,100"
        />
      </svg>
    </div>
  );
};

export default GradientChart;
