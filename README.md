# AquaLens AI
### *See The Hidden Water Behind Every Bite*

> **Every bite has a story. Now you can see it.**
> Built for a 150-team hackathon. Built to be remembered.

---

## Table of Contents
1. [Pitch](#1-pitch)
2. [What We Actually Build (MLD)](#2-what-we-actually-build-mld)
3. [The Seven Foods — Full Dataset](#3-the-seven-foods--full-dataset)
4. [Aqua AI — Personality System](#4-aqua-ai--personality-system)
5. [Demo Script — The Judge Journey](#5-demo-script--the-judge-journey)
6. [Real vs. Mocked — Said Out Loud](#6-real-vs-mocked--said-out-loud)
7. [Tech Stack](#7-tech-stack)
8. [Build Checklist With Gates](#8-build-checklist-with-gates)
9. [Team Split](#9-team-split)
10. [Fallback Plan](#10-fallback-plan)
11. [Slides & One-Pager](#11-slides--one-pager)
12. [Post-Hackathon Roadmap](#12-post-hackathon-roadmap)

---

## 1. Pitch

**Opening line (memorize this, say it first, slow):**
> "Most sustainability apps show you a number. We show you a story."

**Elevator pitch:**
> "Snap a photo of your food. AquaLens reveals the hidden water inside it — visualized, explained, and turned into something you can save, track, and feel proud of. Every meal becomes a small decision with a planetary echo."

**Closing tagline:**
> "Every bite has a story. Now you can see it."

---

## 2. What We Actually Build (MLD)

One screen flow. Seven foods. Zero live dependencies. Everything else is roadmap, not demo.

**The flow:**
1. Upload screen → pick from 7 pre-loaded food photos (or a live camera shot that maps to the closest of the 7, see Section 6)
2. AI Detection screen → confidence ring animation → food name + %
3. Ingredient Breakdown → animated donut chart
4. Total Water + Environmental Equivalents (glasses, showers, drinking-days)
5. Sustainability Score (0–100, color-coded)
6. Aqua AI quip (typing animation)
7. What-If Simulator → swap to any of the other 6 foods → instant recompute → litres saved
8. Water Bank → animated balance increase
9. Streak badge (simple, static increment — not over-engineered)
10. **Earth Impact Simulator** → grand finale, always closes the demo

Everything is driven by one static JSON file. No backend call is on the critical path.

---

## 3. The Seven Foods — Full Dataset

Picked to cover a "guilt" anchor, a "virtue" anchor, and middle ground — so the What-If Simulator always produces a satisfying swap no matter which food a judge picks.

```json
[
  {
    "id": "samosa",
    "name": "Samosa",
    "image": "samosa.jpg",
    "confidence": 0.94,
    "ingredients": [
      {"name": "Potato", "percentage": 60, "waterPerKg": 110},
      {"name": "Wheat Flour", "percentage": 25, "waterPerKg": 100},
      {"name": "Oil", "percentage": 10, "waterPerKg": 200},
      {"name": "Spices", "percentage": 5, "waterPerKg": 50}
    ],
    "totalWaterL": 170,
    "equivalent": {"glasses": 850, "showers": 3, "drinkingDays": 7},
    "sustainabilityScore": 68,
    "quipTier": "medium",
    "alternatives": ["dhokla", "idli", "dosa"]
  },
  {
    "id": "pizza",
    "name": "Cheese Pizza (slice)",
    "image": "pizza.jpg",
    "confidence": 0.91,
    "ingredients": [
      {"name": "Cheese", "percentage": 35, "waterPerKg": 5000},
      {"name": "Wheat Flour", "percentage": 30, "waterPerKg": 100},
      {"name": "Tomato Sauce", "percentage": 20, "waterPerKg": 180},
      {"name": "Toppings/Oil", "percentage": 15, "waterPerKg": 250}
    ],
    "totalWaterL": 1260,
    "equivalent": {"glasses": 6300, "showers": 21, "drinkingDays": 52},
    "sustainabilityScore": 42,
    "quipTier": "high-mid",
    "alternatives": ["dhokla", "idli", "dosa"]
  },
  {
    "id": "burger",
    "name": "Beef-style Burger",
    "image": "burger.jpg",
    "confidence": 0.93,
    "ingredients": [
      {"name": "Patty", "percentage": 45, "waterPerKg": 15000},
      {"name": "Bun", "percentage": 20, "waterPerKg": 100},
      {"name": "Cheese", "percentage": 15, "waterPerKg": 5000},
      {"name": "Veggies/Sauce", "percentage": 20, "waterPerKg": 150}
    ],
    "totalWaterL": 2400,
    "equivalent": {"glasses": 12000, "showers": 40, "drinkingDays": 100},
    "sustainabilityScore": 21,
    "quipTier": "high",
    "alternatives": ["dhokla", "idli", "dosa"]
  },
  {
    "id": "dosa",
    "name": "Plain Dosa",
    "image": "dosa.jpg",
    "confidence": 0.95,
    "ingredients": [
      {"name": "Rice", "percentage": 60, "waterPerKg": 2500},
      {"name": "Urad Dal", "percentage": 30, "waterPerKg": 4000},
      {"name": "Oil", "percentage": 10, "waterPerKg": 200}
    ],
    "totalWaterL": 210,
    "equivalent": {"glasses": 1050, "showers": 4, "drinkingDays": 9},
    "sustainabilityScore": 64,
    "quipTier": "medium",
    "alternatives": ["dhokla", "idli"]
  },
  {
    "id": "biryani",
    "name": "Chicken Biryani",
    "image": "biryani.jpg",
    "confidence": 0.90,
    "ingredients": [
      {"name": "Chicken", "percentage": 40, "waterPerKg": 4300},
      {"name": "Rice", "percentage": 45, "waterPerKg": 2500},
      {"name": "Oil/Ghee", "percentage": 10, "waterPerKg": 200},
      {"name": "Spices", "percentage": 5, "waterPerKg": 50}
    ],
    "totalWaterL": 980,
    "equivalent": {"glasses": 4900, "showers": 16, "drinkingDays": 40},
    "sustainabilityScore": 37,
    "quipTier": "high-mid",
    "alternatives": ["dhokla", "idli", "dosa"]
  },
  {
    "id": "dhokla",
    "name": "Dhokla",
    "image": "dhokla.jpg",
    "confidence": 0.96,
    "ingredients": [
      {"name": "Gram Flour", "percentage": 70, "waterPerKg": 130},
      {"name": "Oil", "percentage": 10, "waterPerKg": 200},
      {"name": "Spices/Curd", "percentage": 20, "waterPerKg": 90}
    ],
    "totalWaterL": 90,
    "equivalent": {"glasses": 450, "showers": 2, "drinkingDays": 4},
    "sustainabilityScore": 88,
    "quipTier": "low",
    "alternatives": []
  },
  {
    "id": "idli",
    "name": "Idli (2 pieces)",
    "image": "idli.jpg",
    "confidence": 0.97,
    "ingredients": [
      {"name": "Rice", "percentage": 60, "waterPerKg": 2500},
      {"name": "Urad Dal", "percentage": 40, "waterPerKg": 4000}
    ],
    "totalWaterL": 100,
    "equivalent": {"glasses": 500, "showers": 2, "drinkingDays": 4},
    "sustainabilityScore": 85,
    "quipTier": "low",
    "alternatives": ["dhokla"]
  }
]
```

Score & data sources: Scores are manually curated based on total water and ingredient water intensity. Water footprint estimates are drawn from the Water Footprint Network and Hoekstra & Mekonnen (2011). For this demo build, they are deliberately simplified — we'll say so if asked (see Section 6).

---

## 4. Aqua AI — Personality System

Quips keyed by quipTier, not hardcoded per food, so the system reads as a real engine.

| Tier | Score Range | Quip Pool (rotate randomly) |
| --- | --- | --- |
| low | 80–100 | "You're basically a water-bending legend. The oceans are applauding." / "Dhokla energy. The rivers are taking notes." |
| medium | 55–79 | "A samosa isn't a crime, but let's not call it environmental activism." / "It's fine. The glaciers aren't angry — just disappointed." |
| high-mid | 30–54 | "That slice just filed a missing-water report." / "Okay Captain Carbon, maybe we try some greens tomorrow?" |
| high | 0–29 | "You somehow turned lunch into a hydrological event." / "That burger just filed a missing-water report." |

Contextual extras (use exactly once each, at the moment they're triggered):
- What-If swap accepted: "Look at you, saving litres and looking smart doing it."
- Water Bank crosses a round number (e.g. 5,000L): "Five thousand litres saved. The math is starting to feel personal."
- Earth Impact Simulator reveal: "One small swap, a planetary ripple."

Render with a 25–35ms-per-character typing animation, capped at ~1.5s total so it never drags the demo.

---

## 5. Demo Script — The Judge Journey

### Step 1 — The Hook
"Every meal hides a number nobody tells you. Let's reveal one."
Tap pizza (a bold opening choice — start with a high-impact food, not a safe one; it makes the contrast with the swap later much bigger).

### Step 2 — AI Detection
Ring spins, locks: "Pizza — 91% confidence."
"Our AI knows its mozzarella from its marinara."

### Step 3 — Ingredient Breakdown
Donut chart animates in. "Cheese alone is nearly 5,000 litres per kilogram. That slice just got expensive."

### Step 4 — Environmental Equivalents
"1,260 litres. That's 21 showers, hidden inside a slice of pizza."

### Step 5 — Sustainability Score
"42 out of 100." Pause. Let the red number sit for a second — don't rush past it.

### Step 6 — Aqua AI Roast
Typing animation: "That slice just filed a missing-water report."
(First laugh.)

### Step 7 — What-If Simulator
"What if we swap to something local?" Dropdown → Dhokla.
Recompute live: 90L. Saved: 1,170L.

### Step 8 — Water Bank
Balance jumps. "Feels less like guilt, more like a savings account, doesn't it?"

### Step 9 — Streak Badge
Quick beat, don't dwell: "Four days in. Water Rookie."

### Step 10 — Earth Impact Simulator (the finale, protect this no matter what gets cut)
"Now scale it. What if one million people made that same swap, today?"
Number counts up: 1.17 billion litres saved — enough to fill over 460 Olympic swimming pools.

### Close
"Every bite has a story. Now you can see it."

Total runtime target: 90 seconds, rehearsed until it's under that.

---

## 6. Real vs. Mocked — Said Out Loud

State this proactively if asked, don't wait to get caught:

"The detection, water engine, What-If Simulator, and Water Bank are fully live, computed in real time from our dataset. Streaks and leaderboards are UI-complete and built on the same data model — for the hackathon we're running them on local state instead of a live backend, so the demo never depends on network conditions."

Live photo handling: if a judge wants to scan their own food, accept the photo, but run simple image-similarity matching (or just ask "closest to: rice, fried snack, bread, or salad?") to map it to one of the 7 dataset entries, and say so: "We're matching this to the closest profile in our verified dataset rather than guessing — keeps the numbers honest." This turns a risk into a credibility moment instead of a crash risk.

Score methodology, if asked: "Scores are curated for this build using total water and ingredient intensity; the full model would include regional water scarcity and seasonal factors." Honest, fast, doesn't undersell the work.

---

## 7. Tech Stack

| Layer | Tech | Notes |
| --- | --- | --- |
| Frontend | React + Vite, Tailwind, Shadcn UI | Fast iteration |
| Animation | Framer Motion | Used on chart entrance, score reveal, Water Bank counter — nowhere else. Don't animate everything. |
| Charts | Recharts | Donut chart only |
| State | React Context + localStorage | No backend needed for demo |
| AI (optional, not critical path) | Gemini Vision, prompt in Appendix | Only used for the "live photo" stretch feature; dataset path never touches it |
| Hosting | Vercel | One link, works offline once loaded (cache the JSON) |

---

## 8. Build Checklist With Gates

Hard checkpoints. If a gate is missed, cut the next non-essential feature — don't slip the gate.

| Gate | Deadline | Must be true |
| --- | --- | --- |
| G1 | Hour 3 | Upload → detection → score screen works end-to-end with 1 hardcoded food, zero styling |
| G2 | Hour 7 | All 7 foods wired from JSON; donut chart live; ingredient breakdown correct |
| G3 | Hour 10 | What-If Simulator computes correctly for every food pair; Water Bank updates |
| G4 | Hour 13 | Aqua AI quips rendering with typing animation; Earth Impact Simulator working |
| G5 | Hour 16 | Full Framer Motion polish pass — and only a polish pass, no new features after this gate |
| G6 | Hour 18 | Confirmed zero live network calls on critical path; works in airplane mode |
| G7 | Hour 19 | Backup video recorded |
| G8 | Hour 22 | 5 full dry runs completed, script under 90 seconds, all known breakpoints fixed |
| G9 | Hour 23.5 | Slides + one-pager done |
| G10 | Hour 24 | Buffer / rest |

If you're ahead of schedule after G6, the only approved stretch goals, in order: (1) live-photo matching from Section 6, (2) mess-menu analyzer as a second screen. Nothing else.

---

## 9. Team Split

| Role | Owns | Hard constraint |
| --- | --- | --- |
| Frontend Lead | All screens, chart, animation pass | Cannot start animation before G2 |
| Data/Logic | JSON dataset, What-If math, Water Bank logic, Aqua quip engine | Dataset frozen by Hour 5 — no late edits during build |
| Story/Presentation | Demo script rehearsal, slides, one-pager, judge Q&A prep (Section 6 answers memorized) | Owns timing the 90-second run |
| Floating/Support | Backup video, fallback testing, bug triage during dry runs | Reports gate status against the table above |

If team is 3 people, merge Story/Presentation into Data/Logic — but the rehearsal time in the checklist doesn't shrink, it just moves to whoever owns it.

---

## 10. Fallback Plan

If anything breaks live:
1. Say it plainly: "Let's switch to our recorded run so you still see the full experience."
2. Play the Hour-19 backup video, full screen, no apology beyond that one sentence.
3. Resume narrating over the video exactly as if it were live — the script doesn't change, only the trust framing does.

Honesty about the switch costs nothing; getting caught faking it costs everything.

---

## 11. Slides & One-Pager

Five slides, no more:
- The hook — one sentence, one image (the pizza, pre-numbers)
- The reveal — same pizza, now with the 1,260L number and equivalents
- The product — 4 screenshots of the live flow (detection → breakdown → simulator → Water Bank)
- The scale — Earth Impact Simulator number, large, alone on the slide
- The ask / close — tagline, QR code to live demo + backup video

One-pager handout: QR code, tagline, 7-food dataset credibility line (Hoekstra & Mekonnen 2011, Water Footprint Network), team names.

---

## 12. Post-Hackathon Roadmap

Compressed to one slide-worth of bullets — don't over-invest here pre-hackathon:
- Real ingredient-decomposition model (replace lookup table)
- Live backend for streaks/leaderboards/friend battles
- Restaurant menu & receipt scanning
- Partner with water-conservation NGOs to convert "saved litres" into real donations

---

## Appendix: Gemini Vision Prompt (stretch feature only, not critical path)

```text
You are an AI that identifies food from images. Return a JSON object with keys:
"foodName": string,
"confidence": number (0-1),
"closestDatasetMatch": one of ["samosa","pizza","burger","dosa","biryani","dhokla","idli"]
If unsure, return "unknown" for foodName and confidence 0.
```
