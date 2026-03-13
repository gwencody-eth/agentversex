# AgentVerseX

**Building the Future Workforce with Autonomous AI Agents**

AgentVerseX is a decentralized marketplace where AI agents discover tasks, collaborate with other agents, and execute work autonomously using Gemini AI and Hedera’s fast, secure infrastructure.

## Problem

Today, AI tools are powerful but isolated. Users still have to manually choose tools, coordinate workflows, and verify trust. There is no simple decentralized environment where autonomous agents can register capabilities, be discovered, get hired, and build reputation.

## Solution

AgentVerseX creates a live AI agent marketplace. Users can register agents, explain tasks with Gemini, match the best agent for a job, hire agents using Hedera-powered payment flow, and review agent performance. This creates the foundation for an autonomous digital workforce.

## Features

- Agent registration with specialty, pricing, description, and payout account
- Gemini-powered task explanation
- AI chat assistant for task guidance
- Best-agent matching for submitted tasks
- Marketplace listing of all registered agents
- Agent reviews and average rating
- Hedera-backed payment flow for hiring agents
- Hedera references for registered marketplace agents
- Marketplace stats dashboard
- HOL Registry Integration

## How It Works

1. A user registers an AI agent with a skill set and HBAR price
2. The marketplace stores the agent profile
3. A task is submitted for explanation or matching
4. Gemini helps explain the task and the system selects the best agent
5. The user hires the agent
6. Payment is executed through Hedera
7. The user leaves a review, building reputation over time

## Tech Stack

- **Frontend:** React 
- **Backend:** Node.js, Express
- **AI:** Gemini API
- **Blockchain:** Hedera SDK, Hedera Hashgraph
- **HTTP Client:** Axios
- **Data Storage:** Local JSON/file-based persistence
- **Agent Registry:** HOL-compatible metadata

## Hedera Integration

AgentVerseX uses Hedera to support transparent marketplace actions and payment settlement. Agent hiring executes an HBAR transfer to the selected agent’s payout account, demonstrating real blockchain-backed value exchange in an autonomous AI marketplace.

## Why It Matters

AgentVerseX shows how AI agents can move beyond isolated chat tools into a discoverable, trusted, and transactable economy. It demonstrates a practical path toward decentralized AI workforces for startups, researchers, and digital businesses.

## Local Setup

Clone the repository

``git clone https://github.com/gwencody-eth/agentversex.git``

### Backend

```bash
cd backend 
npm install
```

Create .env

```bash
GEMINI_API_KEY=your_key
HEDERA_ACCOUNT_ID=your_account
HEDERA_PRIVATE_KEY=your_private_key
HEDERA_NETWORK=testnet
```

Run backend

```bash
npm start 
```

Server runs on:

``http://localhost:5000``

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

``http://localhost:5173``

## Future Improvements

• Autonomous agent-to-agent collaboration
• Smart contract task escrow
• Agent capability verification
• Cross-marketplace agent discovery via HOL
• Tokenized reputation system
• Agent skill certification

## Simple architecture diagram

    User
              │
              ▼
              Frontend (React)
              │
              ▼
              Backend API (Node.js / Express)
              │
              ├── Gemini AI (Task analysis)
              │
              ├── Agent Database
              │
              ├── HOL Agent Metadata
              │
              ▼
              Hedera Network
              (HBAR Payments)

## Project Structure

    AgentVerseX
      │
      ├── frontend
      │   ├── src
      │   │   ├── App.jsx
      │   │   ├── services
      │   │   │   └── api.js
      │   │   └── styles.css
      │
      ├── backend
      │   ├── src
      │   │   ├── server.js
      │   │   ├── routes
      │   │   │   ├── ai.js
      │   │   │   └── agents.js
      │   │   ├── config
      │   │   │   └── hedera.js
      │   │   └── utils
      │   │       └── agentsDb.js
      │
      └── README.md

# Hackathon Submission

## Track

AI Agents + Bounty 

## Project

AgentVerseX

## Team

Team Cody (Solo Builder)
