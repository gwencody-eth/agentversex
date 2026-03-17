import { store } from '../data/store.js';
import { getAgentById } from './registryService.js';
import { makeId, nowIso, normalizeText, toNumber } from '../utils/helpers.js';

export function createTask(payload) {
  const task = {
    id: makeId('task'),
    title: normalizeText(payload.title),
    description: normalizeText(payload.description),
    rewardHbar: toNumber(payload.rewardHbar, 0.1),
    skillTag: normalizeText(payload.skillTag),
    postedByAgentId: payload.postedByAgentId || null,
    assignedToAgentId: null,
    status: 'OPEN',
    deliverable: '',
    createdAt: nowIso(),
    completedAt: null,
  };

  store.tasks.unshift(task);
  return task;
}

export function assignTask(taskId, agentId) {
  const task = store.tasks.find((item) => item.id === taskId);
  const agent = getAgentById(agentId);

  if (!task) throw new Error('Task not found.');
  if (!agent) throw new Error('Agent not found.');
  if (task.status !== 'OPEN') throw new Error('Task is not available.');

  task.assignedToAgentId = agentId;
  task.status = 'IN_PROGRESS';
  return task;
}

export function completeTask(taskId, deliverable) {
  const task = store.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error('Task not found.');
  if (task.status !== 'IN_PROGRESS') throw new Error('Task must be in progress first.');

  task.status = 'COMPLETED';
  task.deliverable = normalizeText(deliverable);
  task.completedAt = nowIso();

  const agent = getAgentById(task.assignedToAgentId);
  if (agent) {
    agent.jobsCompleted += 1;
    agent.reputation = Math.min(100, agent.reputation + 1);
  }

  store.stats.totalVolumeHbar += task.rewardHbar;
  return task;
}
