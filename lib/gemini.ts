import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Model name options (try these if one doesn't work):
// - "gemini-flash-latest" (recommended for latest Flash model)
// - "gemini-pro-latest" (recommended for latest Pro model)
// - "gemini-pro" (stable, widely supported)
// - "gemini-1.5-flash" (may not work in v1beta API)
export function getModel() {
  // Using gemini-flash-latest for latest Flash model
  // Change to "gemini-pro" or "gemini-pro-latest" if this doesn't work
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
  });
}
