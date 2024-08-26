'use client'
import React from 'react';

const CircularProgressBar = ({ 
  percentage, 
  color, 
  textColor, 
  labelText, 
  changeText, 
  changeColor,
  filledRatio,
}) => {
  const remainingRatio = 1 - filledRatio;
  const radius = 50;
  const strokeWidth = 15;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

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
        fontSize="20px"
        fontWeight="bold"
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
  changeColor, 
  color, 
  textColor,
  filledRatio,
}) {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgressBar 
            percentage={percentage} 
            color={color} 
            textColor={textColor}
            filledRatio={filledRatio}
          />
          <div style={{ marginLeft: '10px', textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', color: textColor }}>
              {labelText}
            </h4>
            <span style={{ color: changeColor, fontSize: '14px' }}>
              {changeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
