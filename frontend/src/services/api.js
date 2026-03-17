import axios from "axios";

const API_BASE = "https://agentversex.onrender.com";

export async function explainWithGemini(text) {
  const res = await axios.post(`${API_BASE}/api/ai/explain`, { text });
  return res.data.explanation;
}

export async function chatWithAgent(message, agentProfile) {
  const res = await axios.post(`${API_BASE}/api/ai/chat`, {
    message,
    agentProfile,
  });
  return res.data.reply;
}

export async function findBestAgent(task) {
  const res = await axios.post(`${API_BASE}/api/agents/match`, { task });
  return res.data;
}

export async function getAgents() {
  const res = await axios.get(`${API_BASE}/api/agents`);
  return res.data;
}

export async function registerAgent(payload) {
  const res = await axios.post(`${API_BASE}/api/agents/register`, payload);
  return res.data;
}

export async function addReview(agentId, payload) {
  const res = await axios.post(
    `${API_BASE}/api/agents/${agentId}/reviews`,
    payload
  );
  return res.data;
}

export async function hireAgent(agentId, payload) {
  const res = await axios.post(
    `${API_BASE}/api/agents/${agentId}/hire`,
    payload
  );
  return res.data;
}