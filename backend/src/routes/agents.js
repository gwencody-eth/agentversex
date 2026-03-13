import express from "express";
import { Hbar, TransferTransaction, AccountId } from "@hashgraph/sdk";
import { readAgents, writeAgents } from "../utils/agentsDb.js";
import { client, operatorId } from "../config/hedera.js";

const router = express.Router();

function createReferenceId(prefix = "HDR") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function computeAverageRating(reviews = []) {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  return Number((total / reviews.length).toFixed(1));
}

function parseHbarAmount(priceString) {
  const numeric = String(priceString).replace(/[^0-9.]/g, "");
  const amount = Number(numeric);

  if (!amount || Number.isNaN(amount) || amount <= 0) {
    throw new Error("Invalid HBAR amount.");
  }

  return amount;
}

/**
 * Temporary HOL registration helper.
 *
 * This is a safe MVP placeholder:
 * - It keeps your app working now
 * - It gives you a place to wire real HOL registration next
 * - It stores a HOL-style external identity on the agent record
 *
 * Later, replace this with the actual HOL Registry Broker / Standards SDK call.
 */
async function registerAgentOnHOL({ name, specialty, description, endpoint }) {
  try {
    // Demo-mode fallback for now
    // Replace with real HOL registration call when ready
    return {
      success: true,
      agentId: `hol-${Date.now()}`,
      protocol: "a2a",
      endpoint,
      profileUrl: null,
      note: "Demo HOL registration placeholder",
      metadata: {
        name,
        specialty,
        description: description || "",
      },
    };
  } catch (error) {
    console.error("HOL registration error:", error);
    return {
      success: false,
      agentId: null,
      protocol: "a2a",
      endpoint,
      profileUrl: null,
      note: "HOL registration failed",
    };
  }
}

router.get("/", async (req, res) => {
  try {
    const agents = await readAgents();
    res.json(agents);
  } catch (error) {
    console.error("Get agents error:", error);
    res.status(500).json({ error: "Failed to load agents." });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, specialty, price, description, ownerAccountId } = req.body;

    if (!name || !specialty || !price) {
      return res.status(400).json({
        error: "name, specialty, and price are required.",
      });
    }

    if (ownerAccountId) {
      try {
        AccountId.fromString(ownerAccountId);
      } catch {
        return res.status(400).json({
          error: "Invalid Hedera payout account ID.",
        });
      }
    }

    const publicBaseUrl =
      process.env.PUBLIC_BASE_URL || "http://localhost:5000";

    const holResponse = await registerAgentOnHOL({
      name,
      specialty,
      description,
      endpoint: `${publicBaseUrl}/api/agents`,
    });

    const agents = await readAgents();

    const newAgent = {
      id: `agent-${Date.now()}`,
      name,
      specialty,
      price,
      description: description || "",
      riskLevel: "medium",

      // HOL-related fields
      holAgentId: holResponse.agentId,
      holRegistered: Boolean(holResponse.success),
      holProtocol: holResponse.protocol || "a2a",
      holProfileUrl: holResponse.profileUrl || null,
      holEndpoint: holResponse.endpoint || null,

      // Hedera-related fields
      registeredOnHedera: true,
      hederaTxId: null,
      hederaReferenceId: createReferenceId("HDR-AGENT"),
      ownerAccountId: ownerAccountId || "",

      // Reputation
      averageRating: 0,
      reviews: [],
    };

    agents.push(newAgent);
    await writeAgents(agents);

    res.status(201).json({
      message: "Agent registered successfully.",
      agent: newAgent,
      hol: holResponse,
    });
  } catch (error) {
    console.error("Register agent error:", error);
    res.status(500).json({ error: "Failed to register agent." });
  }
});

router.post("/match", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || !task.trim()) {
      return res.status(400).json({ error: "Task is required." });
    }

    const agents = await readAgents();
    const lowerTask = task.toLowerCase();

    let bestAgent = agents[0] || null;
    let reason = "Matched by default marketplace ranking.";
    let confidence = 60;

    for (const agent of agents) {
      const text = `${agent.name} ${agent.specialty} ${agent.description}`.toLowerCase();

      if (lowerTask.includes("defi") && text.includes("defi")) {
        bestAgent = agent;
        reason = "Best match for DeFi-related analysis and protocol risk checks.";
        confidence = 92;
        break;
      }

      if (
        (lowerTask.includes("trade") ||
          lowerTask.includes("trading") ||
          lowerTask.includes("technical")) &&
        text.includes("trading")
      ) {
        bestAgent = agent;
        reason = "Best fit for trading ideas, timing, and technical analysis.";
        confidence = 89;
        break;
      }

      if (
        (lowerTask.includes("research") ||
          lowerTask.includes("summary") ||
          lowerTask.includes("market")) &&
        text.includes("research")
      ) {
        bestAgent = agent;
        reason = "Best fit for research, summaries, and market trend analysis.";
        confidence = 87;
        break;
      }
    }

    res.json({
      bestAgentId: bestAgent?.id || null,
      bestAgent,
      reason,
      confidence,
    });
  } catch (error) {
    console.error("Match agent error:", error);
    res.status(500).json({ error: "Failed to find best agent." });
  }
});

router.post("/:id/reviews", async (req, res) => {
  try {
    const { reviewer, rating, comment } = req.body;
    const agents = await readAgents();

    const agent = agents.find((item) => item.id === req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    const numericRating = Number(rating);

    if (!reviewer || !numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        error: "reviewer and rating (1-5) are required.",
      });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      reviewer,
      rating: numericRating,
      comment: comment || "",
      createdAt: new Date().toISOString(),
    };

    agent.reviews.push(newReview);
    agent.averageRating = computeAverageRating(agent.reviews);

    await writeAgents(agents);

    res.status(201).json({
      message: "Review added successfully.",
      agent,
      review: newReview,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Failed to add review." });
  }
});

router.post("/:id/hire", async (req, res) => {
  try {
    const { hirerName } = req.body;
    const agents = await readAgents();

    const agent = agents.find((item) => item.id === req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    if (!agent.ownerAccountId) {
      return res.status(400).json({
        error: "This agent does not have a Hedera payout account configured.",
      });
    }

    const amount = parseHbarAmount(agent.price);
    const receiverId = AccountId.fromString(agent.ownerAccountId);

    const transferTx = await new TransferTransaction()
      .addHbarTransfer(AccountId.fromString(operatorId), new Hbar(-amount))
      .addHbarTransfer(receiverId, new Hbar(amount))
      .freezeWith(client);

    const txResponse = await transferTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const payment = {
      paymentId: createReferenceId("PAY"),
      hederaPaymentTxId: txResponse.transactionId.toString(),
      receiptStatus: receipt.status.toString(),
      amount: `${amount} HBAR`,
      hiredAt: new Date().toISOString(),
      status: receipt.status.toString() === "SUCCESS" ? "completed" : "failed",
      hirerName: hirerName || "Anonymous User",
      agentId: agent.id,
      agentName: agent.name,
      receiverAccountId: agent.ownerAccountId,
      network: process.env.HEDERA_NETWORK || "testnet",
    };

    res.json({
      message: "Agent hired successfully.",
      payment,
    });
  } catch (error) {
    console.error("Hire agent error:", error);
    res.status(500).json({
      error: error.message || "Failed to hire agent.",
    });
  }
});

export default router;