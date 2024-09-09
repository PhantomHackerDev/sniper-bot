const { Keypair } = require('@solana/web3.js');
const mongoose = require("mongoose");
const Address = require('./model');  // Assuming Address model is correct

// DB Config (choose one source for the MongoDB URI)
const db = require('./config').mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

function getKeyInfo(userId) {
  // Return a promise
  return Address.findOne({ userId: userId })
    .then(user => {
      if (!user) {
        // Generate a new Keypair and save it
        const keyPair = Keypair.generate();
        const address = new Address({
          userId: userId,
          address: JSON.stringify(Array.from(keyPair.secretKey)) // Save as JSON string
        });

        return address.save().then(() => keyPair); // Return the Keypair after saving
      } else {
        // Retrieve and parse the existing Keypair
        const keyPair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(user.address)));
        return keyPair;
      }
    })
    .catch(err => {
      console.error('Error in getKeyInfo:', err); // Better error handling
      throw err; // Re-throw error to be handled by calling code
    });
}
module.exports = getKeyInfo;