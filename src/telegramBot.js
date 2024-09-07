const TelegramBot = require('node-telegram-bot-api');
const { getRaydiumPrice, swapTokensOnRaydium } = require('./raydium');
require('dotenv').config();

// Initialize Telegram bot with your token from .env
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Define commands and handlers for the Telegram bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Use /price to check token prices or /swap to perform a swap.');
});

// Check price command
bot.onText(/\/price/, async (msg) => {
  const chatId = msg.chat.id;
  
  // Fetch the price from Raydium
  const TOKEN_A = new PublicKey('7vfCXTdsSopdd5Qw7i5zB8dNkzLJkZYr9HBQ9gbinbBs');  // USDC Mint
  const TOKEN_B = new PublicKey('So11111111111111111111111111111111111111112');   // SOL Mint
  
  try {
    const price = await getRaydiumPrice(TOKEN_A, TOKEN_B);
    bot.sendMessage(chatId, `The current price of USDC in SOL is: ${price}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Error fetching price. Please try again later.');
  }
});

// Perform a token swap
bot.onText(/\/swap/, async (msg) => {
  const chatId = msg.chat.id;
  
  // Swap a fixed amount, for example, 0.01 USDC to SOL
  const TOKEN_A = new PublicKey('7vfCXTdsSopdd5Qw7i5zB8dNkzLJkZYr9HBQ9gbinbBs');  // USDC Mint
  const TOKEN_B = new PublicKey('So11111111111111111111111111111111111111112');   // SOL Mint

  try {
    await swapTokensOnRaydium(TOKEN_A, TOKEN_B, 0.01);
    bot.sendMessage(chatId, 'Swap executed successfully!');
  } catch (error) {
    bot.sendMessage(chatId, `Error executing swap: ${error.message}`);
  }
});
