import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'PRODUCTION',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  hederaNetwork: process.env.HEDERA_NETWORK || 'testnet',
  hederaAccountId: process.env.HEDERA_ACCOUNT_ID || '',
  hederaPrivateKey: process.env.HEDERA_PRIVATE_KEY || '',
  operatorPublicKey: process.env.HEDERA_PUBLIC_KEY || '',
  taskTopicId: process.env.HEDERA_TASK_TOPIC_ID || '',
  settlementTopicId: process.env.HEDERA_SETTLEMENT_TOPIC_ID || '',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
};

export const hasHederaCredentials = Boolean(env.hederaAccountId && env.hederaPrivateKey);
