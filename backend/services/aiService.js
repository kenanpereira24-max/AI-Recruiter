import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const generateProfileInfo = async (inputText) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Extract professional information from the following text into a structured JSON format with keys: summary, skills (array of strings), experiences (array of objects with job_title, company, description). Return ONLY valid JSON. Do not include markdown blocks. Text: ${inputText}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    text = jsonMatch[0];
  }

  return JSON.parse(text);
};
