const { PublicKey } = require('@solana/web3.js');
const { Amm } = require('@raydium-io/raydium-sdk');
const { connection, WALLET_KEYPAIR } = require('./config');

// Fetch price from Raydium pool
async function getRaydiumPrice(tokenA, tokenB) {
  const poolInfo = await Amm.getAmmInfo(connection, tokenA, tokenB);
  const price = Amm.getPrice(poolInfo);
  return price;
}

// Swap tokens on Raydium
async function swapTokensOnRaydium(tokenA, tokenB, amount) {
  const poolInfo = await Amm.getAmmInfo(connection, tokenA, tokenB);
  
  const transaction = await Amm.swapTransaction({
    connection,
    poolKeys: poolInfo.poolKeys,
    userKeys: {
      tokenAccountA: WALLET_KEYPAIR.publicKey,  // Source token account
      tokenAccountB: WALLET_KEYPAIR.publicKey   // Destination token account
    },
    amountIn: amount
  });

  const signature = await sendAndConfirmTransaction(connection, transaction, [WALLET_KEYPAIR]);
  console.log(`Swap transaction confirmed with signature: ${signature}`);
}

module.exports = {
  getRaydiumPrice,
  swapTokensOnRaydium
};
