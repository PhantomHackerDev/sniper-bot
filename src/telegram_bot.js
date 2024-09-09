const TelegramBot = require('node-telegram-bot-api');
const getKeyInfo = require('./database');
const token = require('./config').token
const { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const bot = new TelegramBot(token, { polling: true });

const connection = new Connection(clusterApiUrl("devnet"));

async function isAllow(keyPair) {
  const balance = await connection.getBalance(keyPair.publicKey);
  const balanceInSOL = balance / LAMPORTS_PER_SOL;
  if(balanceInSOL >= 1) return true;
  else return false;
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const Id = msg.from.id;
  const userId = Id.toString();
  const keyPair = await getKeyInfo(userId);

  const message = `
    *Welcome to SniperBOT*
    Solana's fastest bot to trade any coin (SPL token), built by the SniperBOT community!
    
    You currently have no SOL in your wallet. To start trading, deposit SOL to your SniperBOT wallet address:
    
    \`${keyPair.publicKey.toBase58()}\` (tap to copy)
    
    Once done, tap refresh and your balance will appear here.
    
    To buy a token, enter a ticker, token address, or a URL from [pump.fun](https://pump.fun), Birdeye, Dexscreener or Meteora.
    
    For more info on your wallet and to retrieve your private key, tap the wallet button below. *User funds are safe on SniperBOT*, but if you expose your private key we can't protect you!
  `;
  
    // Inline buttons layout (as seen in the image)
    const options = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔥 Buy', callback_data: 'buy' }, { text: '💰 Sell & Manage', callback_data: 'sell_manage' }],
          [
            { text: '❓ Help', url: 'https://t.me/skyandasura' },
            { text: '👥 Refer Friends', callback_data: 'refer' },
            { text: ' Alerts', callback_data: 'alerts'},
          ],
          [{ text: '💼 Wallet', callback_data: 'wallet' }, { text: '⚙️ Settings', callback_data: 'settings' }]
        ]
      }
    };
    bot.sendMessage(chatId, message, options);
});

bot.on('callback_query', async (callbackQuery) => {
  const message = callbackQuery.message;
  const action = callbackQuery.data;

  const Id = callbackQuery.from.id;
  const userId = Id.toString();
  const keyPair = await getKeyInfo(userId);

  if(isAllow(keyPair)) {
    const options = {
      parse_mode: 'Markdown',
    };
    bot.sendMessage(message.chat.id, `You need to deposit at least 1 SOL on your wallet for this function to work \`${keyPair.publicKey.toBase58()}\` (click to copy)`, options);
    return;
  }

  if (action === 'buy') {
    bot.sendMessage(message.chat.id, "You selected Buy.");
  } else if (action === 'sell_manage') {
    bot.sendMessage(message.chat.id, "You selected Sell & Manage.");
  }
});