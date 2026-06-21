import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY && API_KEY !== "your_api_key_here") {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export async function analyzeFoodImage(base64Image, mimeType) {
  if (!genAI) {
    throw new Error("Gemini API key is missing or invalid. Please add VITE_GEMINI_API_KEY to your .env.local file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an AI that identifies food from images. Return a JSON object with keys:
"foodName": string,
"confidence": number (0-1),
"closestDatasetMatch": one of ["samosa","pizza","burger","dosa","biryani","dhokla","idli"]
If unsure, return "unknown" for foodName and confidence 0.`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code block formatting if present
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (text.startsWith("\`\`\`")) {
      text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
