import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFood } from "../context/FoodContext";
import foods from "../data/foods.json";

export default function DetectionPage() {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete]  = useState(false);
  const { setFoodData } = useFood();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get("foodId");

  const selectedFood = foods.find((f) => f.id === foodId);

  // Guard: no valid food → go home
  useEffect(() => {
    if (!foodId || !selectedFood) navigate("/");
  }, [foodId, selectedFood, navigate]);

  // Progress ticker — 100 steps × 20ms = 2 s
  useEffect(() => {
    if (!selectedFood) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [selectedFood]);

  // At 100%: play "done" animation for 300ms then navigate
  useEffect(() => {
    if (progress === 100 && selectedFood && !complete) {
      setComplete(true);
      setTimeout(() => {
        setFoodData(selectedFood);
        navigate("/result");
      }, 350);
    }
  }, [progress, selectedFood, complete, setFoodData, navigate]);

  if (!selectedFood) return null;

  // SVG ring geometry
  const radius          = 60;
  const stroke          = 5;
  const normR           = radius - stroke * 2;
  const circumference   = normR * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      {/* Pulsing wrapper — stops pulsing when complete */}
      <motion.div
        animate={
          complete
            ? { scale: 1.15, opacity: 0 }
            : { scale: [1, 1.04, 1] }
        }
        transition={
          complete
            ? { duration: 0.3, ease: "easeOut" }
            : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
        }
        className="relative flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normR}
            cx={radius}
            cy={radius}
          />
          {/* Progress arc */}
          <circle
            stroke={progress === 100 ? "#22c55e" : "#000000"}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.05s linear, stroke 0.3s" }}
            r={normR}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>

        {/* Percentage */}
        <motion.span
          className="absolute text-lg font-bold"
          animate={{ color: progress === 100 ? "#16a34a" : "#000000" }}
          transition={{ duration: 0.3 }}
        >
          {progress}%
        </motion.span>
      </motion.div>

      {/* Label */}
      <motion.p
        className="mt-6 text-sm font-semibold tracking-wide text-gray-500 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Scanning {selectedFood.name}…
      </motion.p>
    </div>
  );
}
