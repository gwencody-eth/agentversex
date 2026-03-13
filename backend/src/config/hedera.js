import dotenv from "dotenv";
dotenv.config();

import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

const network = process.env.HEDERA_NETWORK || "testnet";
const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

if (!operatorId || !operatorKey) {
  throw new Error(
    "Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY in backend .env"
  );
}

const client =
  network === "mainnet" ? Client.forMainnet() : Client.forTestnet();

client.setOperator(
  AccountId.fromString(operatorId),
  PrivateKey.fromString(operatorKey)
);

export { client, operatorId };