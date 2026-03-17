import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in your backend .env file."
  );
}

export const genAI = new GoogleGenerativeAI(apiKey);