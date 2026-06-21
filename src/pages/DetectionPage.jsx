import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import foods from "../data/foods.json";

export default function DetectionPage() {
  const [progress, setProgress] = useState(0);
  const { setFoodData } = useFood();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 100 increments of 20ms = 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Fetch the hardcoded pizza data (first element)
      const pizza = foods[0];
      setFoodData(pizza);
      navigate("/result");
    }
  }, [progress, navigate, setFoodData]);

  // SVG ring calculations
  const radius = 60;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <div className="relative flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#e5e7eb" // light gray
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Foreground progress circle */}
          <circle
            stroke="#000000" // black
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
            className="transition-all duration-75 ease-linear"
          />
        </svg>
        {/* Percentage label in the center */}
        <span className="absolute text-lg font-bold">{progress}%</span>
      </div>
      <p className="mt-6 text-sm font-semibold tracking-wide text-gray-500 uppercase">
        Scanning...
      </p>
    </div>
  );
}
