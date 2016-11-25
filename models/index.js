const mongoose = require('mongoose');
const token = require('rand-token');
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

const soulSchema = new Schema({
  displayName: { type: String, required: true, default: `soul-${token.generate(6, '0123456789')}` },
  createdOn: { type: Date, required: true, default: Date.now() },
  lastLogin: { type: Date, required: true, default: Date.now() },
  google: { type: Schema.Types.Mixed },
  github: { type: Schema.Types.Mixed },
  twitter: { type: Schema.Types.Mixed },
});

soulSchema.plugin(findOrCreate);

exports.soul = mongoose.model('soul', soulSchema);