import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";
import agentsRoutes from "./routes/agents.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AgentVerseX API running");
});

app.use("/api/ai", aiRoutes);
app.use("/api/agents", agentsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    "Gemini key loaded:",
    !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
  );
  console.log(`Server running on port ${PORT}`);
});
