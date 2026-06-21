import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import foods from "../data/foods.json";

// Map food IDs to emojis
const emojiMap = {
  samosa: "🥟",
  pizza: "🍕",
  burger: "🍔",
  dosa: "🥞",
  biryani: "🍛",
  dhokla: "🍰",
  idli: "🫓"
};

export default function UploadPage() {
  const navigate = useNavigate();

  const handleSelectFood = (id) => {
    navigate(`/detection?foodId=${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-white text-black">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Ripple</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Select a food to analyze
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg mx-auto">
        {foods.map((food) => (
          <Card
            key={food.id}
            onClick={() => handleSelectFood(food.id)}
            className="cursor-pointer hover:border-black transition-colors border shadow-sm flex flex-col items-center justify-center p-4 text-center"
          >
            <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl" role="img" aria-label={food.name}>
                {emojiMap[food.id] || "🍽️"}
              </span>
              <span className="text-sm font-semibold">{food.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
