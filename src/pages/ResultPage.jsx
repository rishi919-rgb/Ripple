import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  "#22c55e", "#3b82f6", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

// Shared fade-up variant for all section cards
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" },
});

export default function ResultPage() {
  const { foodData, waterBank, streak, addToWaterBank, incrementStreak } =
    useFood();
  const navigate = useNavigate();

  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [swapMessage, setSwapMessage] = useState(null);

  useEffect(() => {
    if (!foodData) navigate("/");
  }, [foodData, navigate]);

  useEffect(() => {
    setSelectedAlternative(null);
    setSwapMessage(null);
  }, [foodData]);

  if (!foodData) return null;

  // ── Derived data ───────────────────────────────────────────────────────────
  const ingredientData = foodData.ingredients.map((ing) => ({
    name: ing.name,
    value: ing.percentage,
  }));

  const score = foodData.sustainabilityScore;
  let scoreBg = "bg-green-50 border-green-200 text-green-700";
  let glowColor = "rgba(34,197,94,0.35)";
  if (score < 50) { scoreBg = "bg-red-50 border-red-200 text-red-700"; glowColor = "rgba(239,68,68,0.35)"; }
  else if (score < 80) { scoreBg = "bg-yellow-50 border-yellow-200 text-yellow-700"; glowColor = "rgba(245,158,11,0.35)"; }

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
    // Page wrapper — subtle overall fade-in
    <motion.div
      className="max-w-lg mx-auto p-4 space-y-5 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Back ──────────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="cursor-pointer -ml-2"
        >
          ← Back to Foods
        </Button>
      </motion.div>

      {/* ── Water Bank & Streak badges ──────────────────────────────────── */}
      <motion.div className="flex gap-3" {...fadeUp(0.05)}>
        <div className="flex-1 rounded-xl border bg-blue-50 border-blue-200 p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
            Water Bank
          </p>
          {/* key = waterBank so Framer Motion re-animates on change */}
          <motion.p
            key={waterBank}
            className="text-xl font-extrabold text-blue-700 mt-0.5"
            initial={{ scale: 1.5, color: "#16a34a" }}
            animate={{ scale: 1, color: "#1d4ed8" }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            💧 {waterBank}L
          </motion.p>
        </div>

        <div className="flex-1 rounded-xl border bg-orange-50 border-orange-200 p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
            Streak
          </p>
          <motion.p
            key={streak}
            className="text-xl font-extrabold text-orange-700 mt-0.5"
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            🔥 {streak} {streak === 1 ? "day" : "days"}
          </motion.p>
        </div>
      </motion.div>

      {/* ── Food name & confidence ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.1)}>
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
      </motion.div>

      {/* ── Donut chart ───────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.18)}>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-700">
              Ingredient Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
                    animationDuration={1500}
                    animationEasing="ease-out"
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
      </motion.div>

      {/* ── 3 Stat cards ─────────────────────────────────────────────── */}
      <motion.div className="grid grid-cols-3 gap-3" {...fadeUp(0.26)}>
        {/* Total water */}
        <Card className="border shadow-sm p-3 text-center flex flex-col items-center justify-center gap-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Total Water
          </p>
          <p className="text-xl font-extrabold">{foodData.totalWaterL}</p>
          <p className="text-[10px] text-gray-500">litres</p>
        </Card>

        {/* Equivalents */}
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

        {/* Score — spring pop + glow pulse */}
        <motion.div
          className={`border rounded-xl shadow-sm p-3 text-center flex flex-col items-center justify-center gap-1 ${scoreBg}`}
          animate={{
            boxShadow: [
              `0px 0px 0px ${glowColor}`,
              `0px 0px 22px ${glowColor}`,
              `0px 0px 0px ${glowColor}`,
            ],
          }}
          transition={{ delay: 0.6, repeat: 1, duration: 1 }}
        >
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">
            Score
          </p>
          <motion.span
            className="text-xl font-extrabold block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 15, delay: 0.35 }}
          >
            {score}
          </motion.span>
          <p className="text-[10px] opacity-70">/100</p>
        </motion.div>
      </motion.div>

      {/* ── Aqua AI Quip ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.34)}>
        <AquaQuip quipTier={foodData.quipTier} />
      </motion.div>

      {/* ── What-If Simulator ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.42)}>
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
                <AnimatePresence>
                  {selectedAlternative && (
                    <motion.div
                      key="savings-preview"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
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
                            {selectedAlternative.name} → {selectedAlternative.totalWaterL}L
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-bold text-gray-700">
                            You would save
                          </span>
                          {/* Spring-pop on each new saved value */}
                          <motion.span
                            key={saved}
                            className={`text-lg font-extrabold ${
                              saved > 0 ? "text-green-600" : "text-red-600"
                            }`}
                            initial={{ scale: 0, rotate: -12 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 320, damping: 14 }}
                          >
                            {saved > 0 ? `+${saved}L` : `${saved}L`}
                          </motion.span>
                        </div>
                        {saved <= 0 && (
                          <p className="text-xs text-red-600 bg-red-50 rounded p-2 border border-red-200">
                            This swap would cost more water — keep your current choice!
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lock In button — hover + tap */}
                <motion.div
                  whileHover={!selectedAlternative || saved <= 0 ? {} : { scale: 1.04 }}
                  whileTap={!selectedAlternative || saved <= 0 ? {} : { scale: 0.96 }}
                >
                  <Button
                    className="w-full cursor-pointer"
                    disabled={!selectedAlternative || saved <= 0}
                    onClick={handleLockIn}
                  >
                    Lock In This Swap 🔒
                  </Button>
                </motion.div>

                {/* Success message */}
                <AnimatePresence>
                  {swapMessage && (
                    <motion.p
                      key="swap-msg"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-sm text-green-700 font-medium bg-green-50 rounded-lg p-3 border border-green-200 text-center"
                    >
                      ✅ {swapMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Earth Impact Simulator — AnimatePresence entrance/exit ──── */}
      <AnimatePresence>
        {selectedAlternative && (
          <motion.div
            key="earth-impact"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            style={{ willChange: "transform" }}
          >
            <EarthImpact savedLitres={saved} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
