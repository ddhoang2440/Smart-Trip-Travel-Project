import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Gemini API Key
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const callGemini = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes and explains user intent clearly.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 512,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Gemini API error:");
    console.error(err.response?.data || err.message);
    throw err;
  }
};
