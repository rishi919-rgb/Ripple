import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomQuip } from "../data/aquaQuips";

const CHAR_DELAY_MS = 30;
const MAX_DURATION_MS = 1500;

/**
 * Renders a typing-effect quip for the given food's quipTier.
 * The quip is chosen once on mount and never changes on re-renders.
 */
export default function AquaQuip({ quipTier }) {
  // Pick quip once — stable across renders
  const quip = useMemo(() => getRandomQuip(quipTier), [quipTier]);

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset when tier changes (different food navigated to)
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    // Cap delay so very long quips don't drag past 1.5s
    const delay = Math.min(CHAR_DELAY_MS, MAX_DURATION_MS / quip.length);

    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(quip.slice(0, indexRef.current));

      if (indexRef.current >= quip.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [quip]);

  return (
    <Card className="border shadow-sm bg-gradient-to-br from-slate-50 to-blue-50 border-blue-100">
      <CardContent className="p-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">🌊</span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">
            Aqua AI
          </p>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {displayed}
            {/* Blinking cursor while typing */}
            {!done && (
              <span className="inline-block w-0.5 h-4 bg-gray-500 ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
