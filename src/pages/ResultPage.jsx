import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

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

  // Transform ingredients to recharts format: value represents the percentage
  const ingredientData = foodData.ingredients.map((ing) => ({
    name: ing.name,
    value: ing.percentage,
  }));

  // Determine sustainability score color
  let scoreColor = "text-green-600 border-green-200 bg-green-50";
  if (foodData.sustainabilityScore < 50) {
    scoreColor = "text-red-600 border-red-200 bg-red-50";
  } else if (foodData.sustainabilityScore < 80) {
    scoreColor = "text-yellow-600 border-yellow-200 bg-yellow-50";
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-2 cursor-pointer">
        &larr; Back to Foods
      </Button>

      {/* Top Card: Food Name & Confidence */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-extrabold">{foodData.name}</CardTitle>
          <CardDescription className="text-sm font-medium text-gray-500">
            {(foodData.confidence * 100).toFixed(0)}% AI detection confidence
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Donut Chart Card */}
      <Card className="border shadow-sm bg-white p-4">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg font-bold text-gray-700">Ingredient Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center items-center">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ingredientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {ingredientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row of 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Water */}
        <Card className="border shadow-sm flex flex-col justify-between p-3 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Total Water
          </span>
          <div className="mt-2">
            <span className="text-xl font-extrabold block">{foodData.totalWaterL}</span>
            <span className="text-[10px] text-gray-500">litres</span>
          </div>
        </Card>

        {/* Equivalents */}
        <Card className="border shadow-sm flex flex-col justify-between p-3 text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Equivalents
          </span>
          <div className="mt-1 flex flex-col gap-0.5 justify-center h-full">
            <span className="text-xs font-semibold text-gray-700">
              🚿 {foodData.equivalent.showers} showers
            </span>
            <span className="text-xs font-semibold text-gray-700">
              🥛 {foodData.equivalent.glasses} glasses
            </span>
          </div>
        </Card>

        {/* Sustainability Score */}
        <Card className={`border shadow-sm flex flex-col justify-between p-3 text-center ${scoreColor}`}>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            Sustainability
          </span>
          <div className="mt-2">
            <span className="text-xl font-extrabold block">
              {foodData.sustainabilityScore}
            </span>
            <span className="text-[10px] opacity-80">/100</span>
          </div>
        </Card>
      </div>

      {/* Try What-If Button */}
      <div>
        <Button className="w-full py-6 text-base cursor-pointer" variant="outline">
          Try What-If (Simulator)
        </Button>
      </div>
    </div>
  );
}
