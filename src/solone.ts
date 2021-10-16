import {
  ConfirmedSignaturesForAddress2Options,
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
import axios, { AxiosRequestConfig } from 'axios';
import { TransactionObject, Cluster, payerType, recieverType, CreateAccountResponse } from './types';

export class Solone {
  private DECIMAL_OFFSET: number = 10 ** 9;
  public connection: ConnectionType;
  public network = 'testnet';
  public payers: {
    [key: string]: payerType;
  };
  public recievers: {
    [key: string]: recieverType;
  };
  public masterUrl: string;
  public masterKey: string;

  /**
   * Create a new Solana Object
   * @param {string} network network to connect
   */

  constructor(network: Cluster, masterUrl?: string, masterKey?: string) {
    this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    this.network = network;
    this.payers = {};
    this.recievers = {};
    this.masterUrl = masterUrl || ' ';
    this.masterKey = masterKey || ' ';
  }

  /**
   * Create a new Solana Object
   * @param {string} network network to connect
   */

  switchRpcUrl = (url: string): void => {
    try {
      this.connection = new Connection(url, 'confirmed');
    } catch (error) {
      throw error;
    }
  };

  switchNetwork = (network: Cluster): void => {
    try {
      this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    } catch (error) {
      throw error;
    }
  };

  getAccountBalance = async (address: string | PublicKeyType): Promise<number> => {
    try {
      await this.apiCall('updateInstanceQuota');
      const balance = await this.apiCall('getAccountBalance', {
        data: {
          publicKey: address,
        },
      });
      console.log({ balance });
      return balance;
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

  getTransactions = async (
    address: string,
    options: ConfirmedSignaturesForAddress2Options,
  ): Promise<Array<TransactionObject>> => {
    try {
      const transactions = await this.apiCall('getAccountTransactions', {
        data: {
          publicKey: address,
          options,
        },
      });
      return transactions;
    } catch (error) {
      throw error;
    }
  };

  fundAccount = async (address: string | PublicKeyType, amount?: number): Promise<string> => {
    try {
      await this.apiCall('updateInstanceQuota');
      const publicKey = new PublicKey(address);
      const hash = await this.connection.requestAirdrop(publicKey, amount || LAMPORTS_PER_SOL);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  addPayer = async (name: string, secretKey?: Uint8Array | string): Promise<boolean> => {
    try {
      const wallet = await this.createAccount(secretKey);
      this.payers[name] = {
        name,
        ...wallet,
      };
      return true;
    } catch (error) {
      return false;
    }
  };

  getPayerWithName = (name: string): payerType | string => {
    try {
      return this.payers[name] ? this.payers[name] : 'NO WALELT NAME';
    } catch (error) {
      throw error;
    }
  };

  getRecieverWithName = (name: string): recieverType | string => {
    try {
      return this.recievers[name] ? this.recievers[name] : 'NO RECIEVER NAME';
    } catch (error) {
      throw error;
    }
  };

  addRecivers = async (name: string, address: string | PublicKeyType): Promise<boolean> => {
    try {
      this.recievers[name] = {
        name,
        publicKey: new PublicKey(address),
      };
      return true;
    } catch (error) {
      return false;
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

  private apiCall = async (name: string, options?: AxiosRequestConfig): Promise<any> => {
    if (!this.masterUrl) {
      throw new Error('masterUrl is not initialized , initialized masterUrl first');
    }
    try {
      const http = axios.create({ baseURL: this.masterUrl });
      const response = await http.post(`${name}`, options, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          network: this.network,
          Authorization: `Bearer ${this.masterKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  };
}
