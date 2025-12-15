import OpenAI from "openai";
import "dotenv/config";

// Khởi tạo client với API key Gemini và baseURL tương thích OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const callGemini = async (prompt) => {
  try {
    // Tạo cuộc hội thoại
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash", // model Gemini
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes and explains user intent clearly.",
        },
        { role: "user", content: prompt },
      ],
    });

    // Chọn kết quả text tốt nhất
    const choice = response.choices[0];
    return choice.message.content;
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
};
