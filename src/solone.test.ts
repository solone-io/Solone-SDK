import { Solone } from './solone';
import { CreateAccountResponse } from './types';

let solone: Solone;
let account: CreateAccountResponse;
const stringSecretKey =
  '[158,59,106,15,158,254,173,174,225,44,124,142,230,199,177,225,40,203,14,203,238,160,87,176,223,56,166,230,50,114,247,123,157,232,71,66,243,141,141,215,199,115,17,225,138,67,76,251,37,38,126,176,142,102,246,155,81,43,251,100,40,85,24,173]';
beforeAll(() => {
  solone = new Solone('testnet');
  solone.masterUrl = 'https://api.solone.io/web3Api/';
  solone.masterKey = 'sol_KfjT5uq88nYjxh5Gktd4I9XfFjioPOFt';
});

describe('solone()', () => {
  describe('connection object', () => {
    test('connection is build successfully', () => {
      expect(solone.connection.commitment).toEqual('confirmed');
    });
    test('switch connection to testnet', () => {
      solone.switchNetwork('testnet');
      expect(solone.connection.commitment).toEqual('confirmed');
    });
  });

  describe('create new account', () => {
    test('create new account using string format secret key', async () => {
      account = await solone.createAccount(stringSecretKey);
      expect(account.stringSecretKey).toEqual(stringSecretKey);
    });

    test('create new account using uint8Array format secret key', async () => {
      account = await solone.createAccount(Uint8Array.from(JSON.parse(stringSecretKey)));
      expect(account.stringSecretKey).toEqual(stringSecretKey);
    });

    test('create new random account', async () => {
      account = await solone.createAccount();
      expect(account.stringPublicKey.length).toEqual(44);
    });
  });

  describe('getTransactions', () => {
    test('get the transaction of wallet', async () => {
      const response = await solone.getTransactions(account.stringPublicKey, {
        limit: 10,
      });
      expect(response).toEqual([]);
    });
  });

  describe('get balance', () => {
    test('get account balance using string format publicKey as a paramter', async () => {
      const balance = await solone.getAccountBalance(account.stringPublicKey);
      expect(balance).toEqual(0);
    });
  });

  describe('airdrop sol to account', () => {
    test('airdrop one sol to the account', async () => {
      await solone.fundAccount(account.stringPublicKey);
    });
  });

  describe('add payer accounts', () => {
    test('add a new random payer to instance', async () => {
      const success = await solone.addPayer('myWallet');
      expect(success).toEqual(true);
    });
  });

  describe('add reciever accounts', () => {
    test('add a new reciver to instance', async () => {
      const success = await solone.addRecivers('myWallet', '92PMwVPHxxBLVxnP2C8sv26QEnKMmoJ1WqEevjq97fHG');
      expect(success).toEqual(true);
    });
  });
});
