<p align="center">
    <a href="https://solone.io">
    <img height="200px" src="https://user-images.githubusercontent.com/38910854/135720585-b32e2371-4866-402d-999f-13984fa13716.png" class="attachment-full size-full" alt="Solone Build Serverless web3 apps" loading="lazy" /></a>
</p>

<h2 align="center">The Ultimate JavaScript SDK for Solona Web3 Development</h2>
<br>

## Overview
Solone SDK is a library that provides the tools, utilities, and infrastructure you need to develop your app. It gives powerful @solana/web3.js web3 functions to develop the Decentralized application rapidly. And then bring it to scale. The Solone SDK enables access to @solana/web3.js functions in great experiences rather than heavy lifting.

The Solone SDK is currently is on initial development and testing phase. We will be releasing the versions on daily basis for upcoming. For more information on Solone and its features, see [the website](https://solone.io/), [twitter](https://twitter.com/solone_io) or [discord](https://discord.gg/9DCCztMcmj).

## Getting Started

The easiest way to integrate the Solone SDK into your JavaScript project is through the [npm module](https://www.npmjs.com/package/solone-sdk).

## Usage

### Initialize

```javascript
import { Solone } from 'solone-sdk';

const solone = new Solone('testnet'); // network could be mainnet-beta, testnet or devnet
```

### API

**`switchNetwork(network: Cluster)`**

to switch the current initialized network of solana eg: from testnet to mainnet-beta.

```javascript
solone.switchNetwork('testnet'); // switch network to solana testnet
solone.switchNetwork('mainnet-beta'); // switch network to solana mainnet-beta
solone.switchNetwork('devnet'); // switch network to solana devnet
```

**`createAccount(secret?: Unint8Array | string)`**

create a new wallet or wallet using a secret key.

```javascript
solone.createAccount(); // create new random account
solone.createAccount(secretKey); // create account using secretKey, Can be either in string or uinit8Array.
```


**`getAccountBalance(address: string | PublicKeyType)`**

get wallet balance using base58 or string public key of wallet.

```javascript
solone.getAccountBalance(stringPublicKey); // get balance using string format public key
solone.getAccountBalance(publicKey); // get balance using using base58 format public key
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

