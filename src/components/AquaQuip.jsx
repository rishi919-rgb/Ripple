import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomQuip } from "../data/aquaQuips";

const CHAR_DELAY_MS = 30;
const MAX_DURATION_MS = 1500;

export default function AquaQuip({ quipTier }) {
  const quip = useMemo(() => getRandomQuip(quipTier), [quipTier]);

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
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
              {/* Emoji fades in after typing is done */}
              <AnimatePresence>
                {done && (
                  <motion.span
                    key="done-emoji"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="ml-1 inline-block"
                  >
                    ✨
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
