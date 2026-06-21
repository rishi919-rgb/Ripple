import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY && API_KEY !== "your_api_key_here") {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export async function analyzeFoodImage(base64Image, mimeType) {
  try {
    if (!genAI) {
      console.warn("Gemini API key is missing or invalid. Falling back to default.");
      return { foodName: "unknown", confidence: 0, closestDatasetMatch: "samosa" };
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
    console.warn("Error calling Gemini API:", error);
    // Graceful fallback for any 404, network, or parsing error
    return { foodName: "unknown", confidence: 0, closestDatasetMatch: "samosa" };
  }
}
