import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import foods from "../data/foods.json";
import { analyzeFoodImage } from "../lib/gemini";

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
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];
        const mimeType = file.type;

        try {
          const result = await analyzeFoodImage(base64String, mimeType);

          if (
            result.closestDatasetMatch &&
            foods.some((f) => f.id === result.closestDatasetMatch)
          ) {
            navigate(`/detection?foodId=${result.closestDatasetMatch}`);
          } else {
            setError(
              "Could not match the food to our dataset. Please try another photo."
            );
            setIsAnalyzing(false);
          }
        } catch (err) {
          setError(
            err.message || "Failed to analyze image. Ensure API key is set."
          );
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read file.");
      setIsAnalyzing(false);
    }
  };

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
        className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg mx-auto mb-8"
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

      {/* Live Photo / Upload Section */}
      <motion.div
        className="w-full max-w-lg mx-auto flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-semibold tracking-wider">
              Or analyze your own
            </span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="mt-6 w-full max-w-xs flex items-center justify-center gap-2"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Analyzing...
            </>
          ) : (
            <>
              <Camera className="h-5 w-5" />
              Snap a Photo
            </>
          )}
        </Button>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-center max-w-xs">
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}
