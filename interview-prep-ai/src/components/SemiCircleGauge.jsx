// src/components/SemiCircleGauge.jsx
import React from "react";

const SemiCircleGauge = ({ percent = 0, size = 220 }) => {
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  const progress = (percent / 100) * circumference;

  return (
    <svg width={size} height={size / 1.1}>
      <defs>
        <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#8BC34A" />
        </linearGradient>
      </defs>

      {/* Background Arc */}
      <path
        d={`
          M ${strokeWidth} ${size / 2}
          A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}
        `}
        fill="none"
        stroke="#ddd"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Animated Progress Arc */}
      <path
        d={`
          M ${strokeWidth} ${size / 2}
          A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${size / 2}
        `}
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference - progress}`}
        style={{
          transition: "stroke-dasharray 1s ease",
        }}
      />

      {/* Percentage Text */}
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="#333"
      >
        {percent}%
      </text>
    </svg>
  );
};

export default SemiCircleGauge;
