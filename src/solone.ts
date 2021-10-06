import {
  Connection as ConnectionType,
  Keypair as KeypairType,
  PublicKey as PublicKeyType,
  TransactionInstruction,
} from '@solana/web3.js';

import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { CreateAccountResponse, TransactionObject, Cluster } from './types';

export class Solone {
  private DECIMAL_OFFSET: number = 10 ** 9;
  public connection: ConnectionType;
  public network = 'testnet';
  constructor(network: Cluster) {
    this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    this.network = network;
  }
  switchNetwork = (network: Cluster): void => {
    try {
      this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    } catch (error) {
      throw error;
    }
  };

  getAccountBalance = async (address: string | PublicKeyType): Promise<number> => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / this.DECIMAL_OFFSET;
    } catch (error) {
      throw error;
    }
  };

  createAccount = async (secret?: Uint8Array | string): Promise<CreateAccountResponse> => {
    try {
      let keypair: KeypairType;
      if (secret) {
        const secretKey = typeof secret === 'string' ? Uint8Array.from(JSON.parse(secret)) : secret;
        keypair = Keypair.fromSecretKey(secretKey);
      } else {
        keypair = new Keypair();
      }
      const stringSecretKey = JSON.stringify(Array.from(keypair?.secretKey));
      return {
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey,
        stringPublicKey: keypair.publicKey.toString(),
        stringSecretKey,
      };
    } catch (error) {
      throw error;
    }
  };

  getTransactions = async (address: string): Promise<Array<TransactionObject>> => {
    try {
      const publicKey = new PublicKey(address);

      const transSignatures = await this.connection.getConfirmedSignaturesForAddress2(publicKey, {
        limit: 10,
      });
      const transactions = [];
      for (let i = 0; i < transSignatures.length; i++) {
        const signature = transSignatures[i].signature;
        const confirmedTransaction = await this.connection.getConfirmedTransaction(signature);
        if (confirmedTransaction) {
          const { meta } = confirmedTransaction;
          if (meta) {
            const oldBalance = meta.preBalances;
            const newBalance = meta.postBalances;
            const amount = oldBalance[0] - newBalance[0];
            const transWithSignature = {
              signature,
              ...confirmedTransaction,
              fees: meta?.fee,
              amount,
            };
            transactions.push(transWithSignature);
          }
        }
      }
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  fundAccount = async (address: string | PublicKeyType, amount?: number): Promise<string> => {
    try {
      const publicKey = new PublicKey(address);
      const hash = await this.connection.requestAirdrop(publicKey, amount || LAMPORTS_PER_SOL);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  sendTransaction = async (
    toPubkey: PublicKeyType,
    fromPubkey: PublicKeyType,
    amount: number,
    secretKey: Uint8Array,
  ): Promise<string> => {
    const instructions: TransactionInstruction = SystemProgram.transfer({
      toPubkey,
      fromPubkey,
      lamports: amount,
    });

    const signers = [
      {
        publicKey: fromPubkey,
        secretKey,
      },
    ];

    const transaction = new Transaction().add(instructions);

    const hash = await sendAndConfirmTransaction(this.connection, transaction, signers);

    return hash;
  };
}
