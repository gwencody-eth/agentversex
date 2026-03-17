import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function explainTask(taskText) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain this task clearly for an AI agent marketplace user:\n\n${taskText}`,
  });

  return response.text;
}

export async function matchBestAgent(taskText, agents) {
  const prompt = `
You are an agent router in a decentralized AI agent marketplace.

Task:
${taskText}

Available agents:
${JSON.stringify(agents, null, 2)}

Return ONLY valid JSON in this format:
{
  "bestAgentId": "string",
  "reason": "string",
  "confidence": 0.0
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const text = response.text.trim();

  try {
    return JSON.parse(text);
  } catch {
    return {
      bestAgentId: agents?.[0]?.id || null,
      reason: text,
      confidence: 0.5,
    };
  }
}

export async function generateAgentReply(userMessage, agentProfile) {
  const prompt = `
You are this AI agent:
${JSON.stringify(agentProfile, null, 2)}

User message:
${userMessage}

Reply naturally, helpfully, and briefly.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}