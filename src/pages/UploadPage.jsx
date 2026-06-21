import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import foods from "../data/foods.json";

const emojiMap = {
  samosa: "🥟",
  pizza: "🍕",
  burger: "🍔",
  dosa: "🥞",
  biryani: "🍛",
  dhokla: "🍰",
  idli: "🫓",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:  { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-white text-black">
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight">Ripple</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Select a food to analyze
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {foods.map((food) => (
          <motion.div
            key={food.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.04,
              boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/detection?foodId=${food.id}`)}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center p-4 text-center"
            style={{ willChange: "transform" }}
          >
            <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
              <motion.span
                className="text-4xl"
                role="img"
                aria-label={food.name}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                {emojiMap[food.id] || "🍽️"}
              </motion.span>
              <span className="text-sm font-semibold">{food.name}</span>
            </CardContent>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
