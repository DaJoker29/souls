const mongoose = require('mongoose');
const token = require('rand-token');
const findOrCreate = require('mongoose-findorcreate');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const appSchema = new Schema({
  appName: { type: String, required: true, index: true, unique: true, trim: true },
  token: { type: String, required: true, default: () => token.generate(64) },
});

const soulSchema = new Schema({
  displayName: { type: String, required: true, default: `soul-${token.generate(6, '0123456789')}` },
  createdOn: { type: Date, required: true, default: Date.now() },
  lastLogin: { type: Date, required: true, default: Date.now() },
  accounts: {
    google: { type: Schema.Types.Mixed },
    github: { type: Schema.Types.Mixed },
    twitter: { type: Schema.Types.Mixed },
    facebook: { type: Schema.Types.Mixed },
  },
});

soulSchema.plugin(findOrCreate);
appSchema.plugin(uniqueValidator);

module.exports.soul = mongoose.model('soul', soulSchema);
module.exports.app = mongoose.model('App', appSchema);