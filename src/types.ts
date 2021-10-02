import { ConfirmedTransaction } from "@solana/web3.js";

class TransactionWithSignature {
  constructor(
    public signature: string,
    public confirmedTransaction: ConfirmedTransaction
  ) {}
}

module.exports = { TransactionWithSignature };
