import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResultPage() {
  const { foodData } = useFood();
  const navigate = useNavigate();

  useEffect(() => {
    if (!foodData) {
      navigate("/");
    }
  }, [foodData, navigate]);

  if (!foodData) {
    return null;
  }

  // Determine sustainability score color
  let scoreColor = "text-green-600";
  if (foodData.sustainabilityScore < 50) {
    scoreColor = "text-red-600";
  } else if (foodData.sustainabilityScore < 80) {
    scoreColor = "text-yellow-600";
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      {/* Back to Home Button */}
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-2 cursor-pointer">
        &larr; Back
      </Button>

      {/* Main Card */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{foodData.name}</CardTitle>
          <CardDescription>
            {(foodData.confidence * 100).toFixed(0)}% confidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Water */}
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide block">Total Water</span>
            <span className="text-3xl font-extrabold">{foodData.totalWaterL} litres</span>
          </div>

          {/* Sustainability Score */}
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide block">Sustainability Score</span>
            <span className={`text-4xl font-extrabold ${scoreColor}`}>
              {foodData.sustainabilityScore}/100
            </span>
          </div>

          <hr className="border-gray-200" />

          {/* Ingredients */}
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide block mb-2">
              Ingredient Breakdown
            </span>
            <ul className="space-y-1 text-sm">
              {foodData.ingredients.map((ing) => (
                <li key={ing.name} className="flex justify-between">
                  <span className="font-medium text-gray-700">{ing.name}</span>
                  <span className="text-gray-500">{ing.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Equivalents */}
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wide block mb-2">
              Environmental Equivalents
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <span className="block font-bold text-base">{foodData.equivalent.glasses}</span>
                <span className="text-gray-500">glasses</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block font-bold text-base">{foodData.equivalent.showers}</span>
                <span className="text-gray-500">showers</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="block font-bold text-base">{foodData.equivalent.drinkingDays}</span>
                <span className="text-gray-500">days water</span>
              </div>
            </div>
          </div>

          {/* Try What-If Button Placeholder */}
          <div className="pt-4">
            <Button className="w-full cursor-pointer" variant="outline">
              Try What-If (Simulator)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
