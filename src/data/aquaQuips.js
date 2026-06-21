// Quip pool keyed by quipTier
export const QUIP_POOL = {
  low: [
    "You're basically a water-bending legend. The oceans are applauding.",
    "Dhokla energy. The rivers are taking notes.",
  ],
  medium: [
    "A samosa isn't a crime, but let's not call it environmental activism.",
    "It's fine. The glaciers aren't angry — just disappointed.",
  ],
  "high-mid": [
    "That slice just filed a missing-water report.",
    "Okay Captain Carbon, maybe we try some greens tomorrow?",
  ],
  high: [
    "You somehow turned lunch into a hydrological event.",
    "That burger just filed a missing-water report.",
  ],
};

// Contextual one-off quips (used programmatically outside the pool)
export const CONTEXTUAL_QUIPS = {
  swapAccepted: "Look at you, saving litres and looking smart doing it.",
  waterBankMilestone: "Five thousand litres saved. The math is starting to feel personal.",
  earthImpact: "One small swap, a planetary ripple.",
};

/**
 * Pick a random quip from the matching tier.
 * Falls back to "medium" if the tier isn't found.
 */
export const getRandomQuip = (quipTier) => {
  const pool = QUIP_POOL[quipTier] ?? QUIP_POOL["medium"];
  return pool[Math.floor(Math.random() * pool.length)];
};
