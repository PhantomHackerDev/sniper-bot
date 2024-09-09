const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = new Schema({
  userId: {type: String, required: true},
  address: {type: String, required: true}
})

module.exports = Address = mongoose.model("address", AddressSchema);