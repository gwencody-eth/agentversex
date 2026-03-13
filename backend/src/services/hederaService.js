import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';
import { env, hasHederaCredentials } from '../config/env.js';

function createClient() {
  if (!hasHederaCredentials) {
    return null;
  }

  const client = env.hederaNetwork === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(AccountId.fromString(env.hederaAccountId), PrivateKey.fromStringED25519(env.hederaPrivateKey));
  return client;
}

export async function ensureTopic(existingTopicId, memo) {
  if (existingTopicId) {
    return { topicId: existingTopicId, created: false };
  }

  const client = createClient();
  if (!client) {
    return { topicId: 'LOCAL-DEMO-TOPIC', created: false };
  }

  const tx = await new TopicCreateTransaction().setTopicMemo(memo).execute(client);
  const receipt = await tx.getReceipt(client);
  return { topicId: receipt.topicId.toString(), created: true };
}

export async function submitMessage(topicId, message) {
  const client = createClient();
  if (!client || !topicId || topicId === 'LOCAL-DEMO-TOPIC') {
    return {
      status: 'LOCAL_ONLY',
      topicId: topicId || 'LOCAL-DEMO-TOPIC',
      transactionId: `local-${Date.now()}`,
      sequenceNumber: null,
    };
  }

  const txResponse = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(message))
    .execute(client);

  const receipt = await txResponse.getReceipt(client);

  return {
    status: receipt.status.toString(),
    topicId,
    transactionId: txResponse.transactionId.toString(),
    sequenceNumber: receipt.topicSequenceNumber ? Number(receipt.topicSequenceNumber.toString()) : null,
  };
}
