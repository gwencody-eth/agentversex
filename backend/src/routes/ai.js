import express from "express";
import { genAI } from "../config/gemini.js";

const router = express.Router();

function cleanMarkdown(text) {
  return text
    .replace(/#{1,6}\s?/g, "")     // remove ### headings
    .replace(/\*\*/g, "")          // remove bold **
    .replace(/\*/g, "")            // remove single *
    .replace(/`/g, "")             // remove code marks
    .replace(/\n{2,}/g, "\n\n");   // normalize spacing
}

function getCurrentDateContext() {
  const now = new Date();

  return {
    iso: now.toISOString(),
    readable: now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    year: now.getFullYear(),
  };
}

router.post("/explain", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const dateInfo = getCurrentDateContext();

    const prompt = `
You are helping inside an app in the year ${dateInfo.year}.

Today's date is ${dateInfo.readable}.
Current ISO timestamp: ${dateInfo.iso}.

Explain the following clearly.

IMPORTANT:
Do not use markdown formatting.
Do not use **, #, bullet symbols, or code blocks.
Return plain readable text only.
Do not assume the year is 2024.
If you mention time, use ${dateInfo.year} unless the content clearly refers to another year.

Text:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = cleanMarkdown(response.text());

    res.json({ explanation });
  } catch (error) {
    console.error("Explain error:", error);
    res.status(500).json({
      error: error.message || "Failed to explain text.",
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message, agentProfile } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const dateInfo = getCurrentDateContext();

    const prompt = `
You are ${agentProfile?.name || "AgentMarket Assistant"}.
Role: ${agentProfile?.role || "Helpful AI marketplace assistant"}.
Specialty: ${agentProfile?.specialty || "Task guidance and agent selection"}.

IMPORTANT DATE RULES:
- Today's date is ${dateInfo.readable}.
- Current ISO timestamp: ${dateInfo.iso}.
- The current year is ${dateInfo.year}.
- Do not answer as though it is 2024 unless the user is explicitly asking about 2024.
- If the user asks for current, latest, recent, this year, or now, interpret that as ${dateInfo.year}.
- If you are unsure about a date-sensitive fact, say so briefly instead of guessing.

Answer helpfully, clearly, and directly.

User message:
${message}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = cleanMarkdown(response.text());

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat.",
    });
  }
});

export default router;