const { Keypair, Connection } = require('@solana/web3.js');
require('dotenv').config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

const WALLET_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.WALLET_SECRET_KEY || '[]'))
);

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

module.exports = {
  connection,
  WALLET_KEYPAIR
};