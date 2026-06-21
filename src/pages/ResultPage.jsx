import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import foods from "../data/foods.json";
import AquaQuip from "../components/AquaQuip";
import EarthImpact from "../components/EarthImpact";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function ResultPage() {
  const { foodData, waterBank, streak, addToWaterBank, incrementStreak } =
    useFood();
  const navigate = useNavigate();

  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [swapMessage, setSwapMessage] = useState(null);

  // Guard: if no food in context, go home
  useEffect(() => {
    if (!foodData) navigate("/");
  }, [foodData, navigate]);

  // Reset simulator on food change (back + new scan)
  useEffect(() => {
    setSelectedAlternative(null);
    setSwapMessage(null);
  }, [foodData]);

  if (!foodData) return null;

  // ── Donut chart data ──────────────────────────────────────────────────────
  const ingredientData = foodData.ingredients.map((ing) => ({
    name: ing.name,
    value: ing.percentage,
  }));

  // ── Sustainability score colour ───────────────────────────────────────────
  let scoreBg = "bg-green-50 border-green-200 text-green-700";
  if (foodData.sustainabilityScore < 50)
    scoreBg = "bg-red-50 border-red-200 text-red-700";
  else if (foodData.sustainabilityScore < 80)
    scoreBg = "bg-yellow-50 border-yellow-200 text-yellow-700";

  // ── What-If data ──────────────────────────────────────────────────────────
  const alternativesData = (foodData.alternatives || [])
    .map((id) => foods.find((f) => f.id === id))
    .filter(Boolean);

  const saved = selectedAlternative
    ? foodData.totalWaterL - selectedAlternative.totalWaterL
    : 0;

  const handleLockIn = () => {
    if (!selectedAlternative || saved <= 0) return;
    addToWaterBank(saved);
    incrementStreak();
    setSwapMessage(
      `Swap locked! +${saved}L saved. Water Bank is now ${waterBank + saved}L 💧`
    );
    setSelectedAlternative(null);
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5 pb-12">
      {/* ── Back ─────────────────────────────────────────────────────────── */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="cursor-pointer -ml-2"
      >
        ← Back to Foods
      </Button>

      {/* ── Water Bank & Streak badges ───────────────────────────────────── */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border bg-blue-50 border-blue-200 p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
            Water Bank
          </p>
          <p className="text-xl font-extrabold text-blue-700 mt-0.5">
            💧 {waterBank}L
          </p>
        </div>
        <div className="flex-1 rounded-xl border bg-orange-50 border-orange-200 p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
            Streak
          </p>
          <p className="text-xl font-extrabold text-orange-700 mt-0.5">
            🔥 {streak} {streak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* ── Food name & confidence ───────────────────────────────────────── */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-extrabold">
            {foodData.name}
          </CardTitle>
          <CardDescription>
            {(foodData.confidence * 100).toFixed(0)}% AI detection confidence
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ── Donut chart ──────────────────────────────────────────────────── */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-700">
            Ingredient Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ingredientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {ingredientData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── 3 Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border shadow-sm p-3 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Total Water
          </p>
          <p className="text-xl font-extrabold">{foodData.totalWaterL}</p>
          <p className="text-[10px] text-gray-500">litres</p>
        </Card>

        <Card className="border shadow-sm p-3 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Equivalents
          </p>
          <p className="text-xs font-semibold text-gray-700">
            🚿 {foodData.equivalent.showers} showers
          </p>
          <p className="text-xs font-semibold text-gray-700">
            🥛 {foodData.equivalent.glasses} glasses
          </p>
        </Card>

        <Card
          className={`border shadow-sm p-3 text-center flex flex-col items-center justify-center gap-1 ${scoreBg}`}
        >
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">
            Score
          </p>
          <p className="text-xl font-extrabold">
            {foodData.sustainabilityScore}
          </p>
          <p className="text-[10px] opacity-70">/100</p>
        </Card>
      </div>

      {/* ── Aqua AI Quip ─────────────────────────────────────────────────── */}
      <AquaQuip quipTier={foodData.quipTier} />

      {/* ── What-If Simulator ────────────────────────────────────────────── */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-gray-700">
            💡 What-If Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alternativesData.length === 0 ? (
            <p className="text-sm text-green-700 font-medium bg-green-50 rounded-lg p-3 border border-green-200">
              This is already one of the most sustainable choices! 🌊
            </p>
          ) : (
            <>
              {/* Dropdown */}
              <Select
                onValueChange={(val) => {
                  const alt = foods.find((f) => f.id === val);
                  setSelectedAlternative(alt || null);
                  setSwapMessage(null);
                }}
                value={selectedAlternative?.id || ""}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Swap with…" />
                </SelectTrigger>
                <SelectContent>
                  {alternativesData.map((alt) => (
                    <SelectItem
                      key={alt.id}
                      value={alt.id}
                      className="cursor-pointer"
                    >
                      {alt.name} ({alt.totalWaterL}L)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Savings preview */}
              {selectedAlternative && (
                <div className="rounded-xl border bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current</span>
                    <span className="font-semibold">
                      {foodData.name} → {foodData.totalWaterL}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Alternative</span>
                    <span className="font-semibold">
                      {selectedAlternative.name} →{" "}
                      {selectedAlternative.totalWaterL}L
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-700">
                      You would save
                    </span>
                    <span
                      className={`text-lg font-extrabold ${
                        saved > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {saved > 0 ? `+${saved}L` : `${saved}L`}
                    </span>
                  </div>
                  {saved <= 0 && (
                    <p className="text-xs text-red-600 bg-red-50 rounded p-2 border border-red-200">
                      This swap would cost more water — keep your current
                      choice!
                    </p>
                  )}
                </div>
              )}

              {/* Lock In button */}
              <Button
                className="w-full cursor-pointer"
                disabled={!selectedAlternative || saved <= 0}
                onClick={handleLockIn}
              >
                Lock In This Swap 🔒
              </Button>

              {/* Success message */}
              {swapMessage && (
                <p className="text-sm text-green-700 font-medium bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  ✅ {swapMessage}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Earth Impact Simulator (appears when alternative selected) ────── */}
      {selectedAlternative && <EarthImpact savedLitres={saved} />}
    </div>
  );
}
