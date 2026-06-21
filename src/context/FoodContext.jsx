import React, { createContext, useContext, useState, useEffect } from "react";

const FoodContext = createContext(null);

export const FoodProvider = ({ children }) => {
  const [foodData, setFoodDataState] = useState(null);
  const [waterBank, setWaterBank] = useState(0);
  const [streak, setStreak] = useState(0);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedWaterBank = localStorage.getItem("ripple_water_bank");
    if (savedWaterBank) {
      setWaterBank(parseInt(savedWaterBank, 10));
    }
    const savedStreak = localStorage.getItem("ripple_streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
  }, []);

  const setFoodData = (food) => {
    setFoodDataState(food);
  };

  const addToWaterBank = (amount) => {
    setWaterBank((prev) => {
      const newVal = prev + amount;
      localStorage.setItem("ripple_water_bank", newVal.toString());
      return newVal;
    });
  };

  const incrementStreak = () => {
    setStreak((prev) => {
      const newVal = prev + 1;
      localStorage.setItem("ripple_streak", newVal.toString());
      return newVal;
    });
  };

  return (
    <FoodContext.Provider
      value={{
        foodData,
        setFoodData,
        waterBank,
        addToWaterBank,
        streak,
        incrementStreak,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};
