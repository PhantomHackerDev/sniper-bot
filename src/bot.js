const { PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { connection, WALLET_KEYPAIR } = require('./config');
const { getRaydiumPrice, swapTokensOnRaydium } = require('./telegramBot');

// Raydium token swap example (USDC -> SOL)
const TOKEN_A = new PublicKey('7vfCXTdsSopdd5Qw7i5zB8dNkzLJkZYr9HBQ9gbinbBs');  // USDC Mint
const TOKEN_B = new PublicKey('So11111111111111111111111111111111111111112');   // SOL Mint

// Bot logic: Fetch price and perform swap
async function runBot() {
  const targetPrice = 20;  // Set your target price here

  while (true) {
    const currentPrice = await getRaydiumPrice(TOKEN_A, TOKEN_B);
    console.log(`Current price: ${currentPrice}`);

    if (currentPrice < targetPrice) {
      console.log(`Price is below target! Swapping tokens...`);
      await swapTokensOnRaydium(TOKEN_A, TOKEN_B, 0.01);  // Swap 0.01 of TOKEN_A
    }

    await sleep(10000);  // Check every 10 seconds
  }
}

// Utility function to sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start the bot
runBot().catch(console.error);
