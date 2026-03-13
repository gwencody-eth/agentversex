import { store } from '../data/store.js';
import { makeId, nowIso, normalizeText } from '../utils/helpers.js';

export function registerAgent(payload) {
  const agent = {
    id: makeId('agent'),
    alias: normalizeText(payload.alias) || `agent-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizeText(payload.name),
    description: normalizeText(payload.description),
    skills: Array.isArray(payload.skills) ? payload.skills : [],
    endpoint: normalizeText(payload.endpoint),
    priceHbar: Number(payload.priceHbar || 0),
    riskProfile: normalizeText(payload.riskProfile || 'balanced'),
    protocol: 'HCS-10',
    status: 'ACTIVE',
    reputation: 100,
    jobsCompleted: 0,
    createdAt: nowIso(),
  };

  store.agents.push(agent);
  return agent;
}

export function listAgents(query = '') {
  const q = normalizeText(query).toLowerCase();
  if (!q) return store.agents;

  return store.agents.filter((agent) => {
    return [agent.name, agent.alias, agent.description, ...(agent.skills || [])]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}

export function getAgentById(id) {
  return store.agents.find((agent) => agent.id === id);
}
