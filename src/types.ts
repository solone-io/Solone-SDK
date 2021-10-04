import { ConfirmedTransaction, ConfirmedTransactionMeta, PublicKey, Transaction } from '@solana/web3.js';

export class TransactionWithSignature {
  constructor(public signature: string, public confirmedTransaction: ConfirmedTransaction) {}
}

export type CreateAccountResponse = {
  publicKey: PublicKey;
  secretKey: Uint8Array;
  stringPublicKey: string;
  stringSecretKey: string;
};

export type TransactionObject = {
  fees?: number;
  amount?: number;
  slot?: number;
  transaction?: Transaction;
  meta?: ConfirmedTransactionMeta | null;
  blockTime?: number | null | undefined;
  signature?: string;
};

export type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';
