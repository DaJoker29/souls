const mongoose = require('mongoose');
const token = require('rand-token');

const Schema = mongoose.Schema;

const soulSchema = new Schema({
  displayName: { type: String, required: true, default: `soul-#${token.generate(7)}` },
  createdOn: { type: Date, required: true, default: Date.now() },
  lastLogin: { type: Date, required: true, default: Date.now() },
  accounts: { type: Schema.Types.Mixed, required: true, default: {} },
});

exports.soul = mongoose.model('soul', soulSchema);