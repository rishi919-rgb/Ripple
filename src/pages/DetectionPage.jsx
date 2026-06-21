import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import foods from "../data/foods.json";

export default function DetectionPage() {
  const [progress, setProgress] = useState(0);
  const { setFoodData } = useFood();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get("foodId");

  // Find the selected food matching the id
  const selectedFood = foods.find((f) => f.id === foodId);

  useEffect(() => {
    // If no valid food found, redirect to home
    if (!foodId || !selectedFood) {
      navigate("/");
      return;
    }

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
  }, [foodId, selectedFood, navigate]);

  useEffect(() => {
    if (progress === 100 && selectedFood) {
      setFoodData(selectedFood);
      navigate("/result");
    }
  }, [progress, selectedFood, navigate, setFoodData]);

  if (!selectedFood) {
    return null;
  }

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
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Foreground progress circle */}
          <circle
            stroke="#000000"
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
        Scanning {selectedFood.name}...
      </p>
    </div>
  );
}
