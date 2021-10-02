import {
  Connection as ConnectionType,
  Keypair as KeypairType,
  SystemProgram as SystemProgramType,
  PublicKey as PublicKeyType,
  Transaction as TransactionType,
  TransactionResponse,
} from "@solana/web3.js";

const {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

class Solone {
  private DECIMAL_OFFSET: number = 10 ** 9;
  public connection: ConnectionType;
  public network: string = "testnet";
  constructor(network: string) {
    this.connection = new Connection(clusterApiUrl(network), "confirmed");
    this.network = network;
  }

  updateConnection = async (network: string) => {
    this.connection = new Connection(clusterApiUrl(network), "confirmed");
  };

  getBalance = async (address: string): Promise<Object> => {
    const publicKey = new PublicKey(address);
    const balance = await this.connection.getBalance(publicKey);
    return balance / this.DECIMAL_OFFSET;
  };

  createAccount = async (secret?: string): Promise<Object> => {
    let keypair: KeypairType;
    if (secret) {
      const secretKey = Uint8Array.from(JSON.parse(secret));
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
  };

  getTransactions = async (address: string): Promise<Object> => {
    const publicKey = new PublicKey(address);

    const transSignatures =
      await this.connection.getConfirmedSignaturesForAddress2(publicKey, {
        limit: 10,
      });

    const transactions = new Array();
    for (let i = 0; i < transSignatures.length; i++) {
      const signature = transSignatures[i].signature;
      const confirmedTransaction =
        await this.connection.getConfirmedTransaction(signature);
      console.log(confirmedTransaction?.meta);
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
  };

  fundAccount = async (
    address: string,
    valueInLamports: string
  ): Promise<Object> => {
    const publicKey = new PublicKey(address);
    const hash = await this.connection.requestAirdrop(
      publicKey,
      valueInLamports ? valueInLamports : LAMPORTS_PER_SOL
    );
    return hash;
  };

  sendTransaction = async (
    toPubkey: PublicKeyType,
    fromPubkey: PublicKeyType,
    amount: string,
    secretKey: Uint8Array
  ): Promise<Object> => {
    const instructions: SystemProgramType = SystemProgram.transfer({
      toPubkey,
      fromPubkey,
      lamports: amount,
    });

    console.log({ instructions });

    const signers = [
      {
        publicKey: fromPubkey,
        secretKey,
      },
    ];
    console.log({ signers });

    const transaction: TransactionResponse = new Transaction().add(
      instructions
    );

    console.log({ transaction });

    const hash = await sendAndConfirmTransaction(
      solone.connection,
      transaction,
      signers
    );

    console.log({ hash });

    return hash;
  };
}

const solone = new Solone("testnet");

module.exports = { solone };
