import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load KEY từ .env
// Tạo KEY tại:
// https://aistudio.google.com/app/apikey

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getModel = async () => {
  try {
    const result = await genai.listModels();

    for (const m of result.models) {
      if (
        m.name.includes("flash-latest") &&
        m.supportedGenerationMethods?.includes("generateContent")
      ) {
        return m.name;
      }
    }
    for (const m of result.models) {
      if (
        m.name.includes("flash") &&
        m.supportedGenerationMethods?.includes("generateContent")
      ) {
        return m.name;
      }
    }
    for (const m of result.models) {
      if (
        m.name.includes("pro") &&
        m.supportedGenerationMethods?.includes("generateContent")
      ) {
        return m.name;
      }
    }

    return "gemini-flash-latest";
  } catch (err) {
    console.error("Error listing models:", err);
    return "gemini-flash-latest";
  }
};

export const callGemini = async (prompt) => {
  try {
    const modelName = await getModel();
    const model = genai.getGenerativeModel({ model: modelName });

    const response = await model.generateContent(prompt);

    if (!response.response?.candidates?.length) {
      console.log("Gemini: No candidates returned");
      return null;
    }

    const candidate = response.response.candidates[0];

    if (!candidate.content?.parts?.length) {
      console.log("Gemini: No content parts", candidate.finishReason);
      return null;
    }

    return candidate.content.parts[0].text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return null;
  }
};
