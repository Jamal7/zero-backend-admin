'use client'
import React from 'react';
import MovingCart from './MovingGradientChart';

const CircularProgressBar = ({ 
  percentage, 
  color, 
  textColor, 
  filledRatio,
}) => {
  const remainingRatio = 1 - filledRatio;
  const radius = 70;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <svg
      height={radius * 2}
      width={radius * 2.1}
      className="sm:h-[120px] sm:w-[130px]" // Added for responsive scaling
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
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference * filledRatio}, ${circumference * remainingRatio}`}
        strokeDashoffset={circumference * (1 - filledRatio)}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`} 
        style={{
          strokeLinecap: 'butt',
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`0.5 2`}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(${360 * filledRatio - 90} ${radius} ${radius})`}
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
        fill={textColor}
        fontSize="20px" // Dynamic sizing for larger screens
        fontWeight="400"
        className="sm:text-[18px]" // Smaller text for tablet view
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default function Charts({ 
  labelText, 
  percentage, 
  changeText, 
  color, 
  textColor,
  filledRatio,
}) {
  return (
    
    <div className="relative p-6 sm:p-4 md:p-6 md:w-[33.3%] w-[90%]  bg-white rounded-lg flex flex-col sm:flex-row items-center justify-around box-border">
      {/* Options Icon at the Top Right */}
      <div className="absolute top-2.5 right-7 h-5 cursor-pointer">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          width="50px" 
          height="25px" 
          className="text-gray-300"
        >
          <path 
            d="M5 10C5 8.89543 5.89543 8 7 8C8.10457 8 9 8.89543 9 10C9 11.1046 8.10457 12 7 12C5.89543 12 5 11.1046 5 10Z" 
          />
          <path 
            d="M11 10C11 8.89543 11.8954 8 13 8C14.1046 8 15 8.89543 15 10C15 11.1046 14.1046 12 13 12C11.8954 12 11 11.1046 11 10Z" 
          />
          <path 
            d="M17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10Z" 
          />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <CircularProgressBar 
            percentage={percentage} 
            color={color} 
            textColor={textColor}
            filledRatio={filledRatio}
          />
          <div className="w-full sm:w-2/5 md:text-left text-center mt-2.5">
            <h4 className="m-0 text-lg font-bold text-gray-700 sm:text-base"> {/* Adjusted font size */}
              {labelText} 
            </h4>
            <div className="flex items-baseline gap-2.5">
              <span className="text-gray-800 text-sm font-normal flex items-end">
                {changeText}
              
                {/* Dropdown Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  width="14px" 
                  height="14px" 
                  className="ml-1.25 text-gray-800"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
              <MovingCart className="ml-2.5"/>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};
