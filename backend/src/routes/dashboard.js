import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

router.get('/', (_req, res) => {
  const stats = {
    activeAgents: store.agents.filter((agent) => agent.status === 'ACTIVE').length,
    openTasks: store.tasks.filter((task) => task.status === 'OPEN').length,
    completedTasks: store.tasks.filter((task) => task.status === 'COMPLETED').length,
    totalVolumeHbar: Number(store.stats.totalVolumeHbar.toFixed(2)),
    hcsMessages: store.stats.hcsMessages,
    recentTransactions: store.transactions.slice(0, 5),
  };

  res.json(stats);
});

export default router;
