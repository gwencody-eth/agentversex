import express from 'express';
import { createTask, assignTask, completeTask } from '../services/taskService.js';
import { submitMessage } from '../services/hederaService.js';
import { env } from '../config/env.js';
import { store } from '../data/store.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ tasks: store.tasks });
});

router.post('/', async (req, res) => {
  try {
    const task = createTask(req.body);
    const ledger = await submitMessage(env.taskTopicId || 'LOCAL-DEMO-TOPIC', {
      type: 'TASK_POSTED',
      task,
      at: new Date().toISOString(),
    });
    store.stats.hcsMessages += 1;
    res.status(201).json({ task, ledger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:taskId/accept', async (req, res) => {
  try {
    const task = assignTask(req.params.taskId, req.body.agentId);
    const ledger = await submitMessage(env.taskTopicId || 'LOCAL-DEMO-TOPIC', {
      type: 'TASK_ACCEPTED',
      taskId: task.id,
      agentId: req.body.agentId,
      at: new Date().toISOString(),
    });
    store.stats.hcsMessages += 1;
    res.json({ task, ledger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:taskId/complete', async (req, res) => {
  try {
    const task = completeTask(req.params.taskId, req.body.deliverable || 'Completed successfully.');
    const settlement = {
      type: 'SETTLEMENT_EXECUTED',
      taskId: task.id,
      rewardHbar: task.rewardHbar,
      assignedToAgentId: task.assignedToAgentId,
      at: new Date().toISOString(),
    };
    const ledger = await submitMessage(env.settlementTopicId || 'LOCAL-DEMO-TOPIC', settlement);
    store.transactions.unshift({
      id: `txn_${Date.now()}`,
      ...settlement,
      transactionId: ledger.transactionId,
    });
    store.stats.hcsMessages += 1;
    res.json({ task, ledger });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
