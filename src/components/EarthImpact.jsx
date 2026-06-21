import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountUp } from "../hooks/useCountUp";

const OLYMPIC_POOL_LITRES = 2_500_000;

/**
 * Earth Impact Simulator — scales water savings to 1 million people.
 * Only shown when `savedLitres` is available (selectedAlternative chosen).
 */
export default function EarthImpact({ savedLitres }) {
  const totalSaved = savedLitres > 0 ? savedLitres * 1_000_000 : 0;
  const pools = savedLitres > 0 ? totalSaved / OLYMPIC_POOL_LITRES : 0;

  // Animated counters — restart whenever the alternative changes
  const animatedLitres = useCountUp(totalSaved, 1400);
  const animatedPools = useCountUp(Math.round(pools), 1200);

  if (savedLitres <= 0) {
    return (
      <Card className="border shadow-sm bg-gradient-to-br from-gray-50 to-slate-100 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-600">
            🌍 Earth Impact Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 italic">
            This swap wouldn't save water at scale — but every mindful choice counts.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format large numbers
  const formattedLitres = animatedLitres.toLocaleString("en-IN");
  const inBillions = (animatedLitres / 1_000_000_000).toFixed(2);
  const showBillions = totalSaved >= 1_000_000_000;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-teal-500 text-white overflow-hidden relative">
      {/* decorative ring */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-lg font-extrabold text-white tracking-tight">
          🌍 Earth Impact Simulator
        </CardTitle>
        <p className="text-blue-100 text-xs font-medium mt-0.5">
          What if 1 million people made this swap?
        </p>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Litres saved */}
        <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100 mb-1">
            Total Water Saved
          </p>
          {showBillions ? (
            <p className="text-4xl font-black leading-none">
              {inBillions}
              <span className="text-xl font-bold ml-1">billion litres</span>
            </p>
          ) : (
            <p className="text-4xl font-black leading-none">
              {formattedLitres}
              <span className="text-xl font-bold ml-1">litres</span>
            </p>
          )}
        </div>

        {/* Olympic pools */}
        <div className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100 mb-1">
            Equivalent Olympic Swimming Pools
          </p>
          <p className="text-4xl font-black leading-none">
            {animatedPools.toLocaleString("en-IN")}
            <span className="text-xl font-bold ml-1">pools</span>
          </p>
        </div>

        {/* Contextual quip */}
        <p className="text-center text-blue-100 text-xs italic font-medium pt-1">
          "One small swap, a planetary ripple." 🌊
        </p>
      </CardContent>
    </Card>
  );
}
