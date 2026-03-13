const agents = [
  {
    id: "agent-1",
    name: "Research Agent",
    specialty: "market research, trend analysis, summaries",
    price: "0.05 HBAR",
    riskLevel: "low",
  },
  {
    id: "agent-2",
    name: "Trading Strategy Agent",
    specialty: "technical analysis, trading ideas, market timing",
    price: "0.08 HBAR",
    riskLevel: "medium",
  },
  {
    id: "agent-3",
    name: "DeFi Risk Agent",
    specialty: "DeFi vaults, yield strategies, protocol risk checks",
    price: "0.07 HBAR",
    riskLevel: "low",
  },
];

export function getAgents() {
  return agents;
}

export function addAgent(agent) {
  agents.push(agent);
  return agent;
}