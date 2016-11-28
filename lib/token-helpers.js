const mongoose = require('mongoose');
const randtoken = require('rand-token');
const app = require('../models').app;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/souls');

function close() {
  mongoose.disconnect();
}

function createApp(appName, callback) {
  if (appName && callback) {
    app.create({ appName }, callback);
  }
}

function removeApp(appName, callback) {
  if (appName && callback) {
    app.findOneAndRemove({ appName }, callback);
  }
}

function regenerate(appName, callback) {
  if (appName && callback) {
    app.findOne({ appName }, (err, app) => {
      if (err) {
        callback(err);
      } else {
        app.token = randtoken.generate(64); // eslint-disable-line no-param-reassign
        app.save(callback);
      }
    });
  }
}

function listApps(callback) {
  if (callback) {
    app.find({}, callback);
  }
}

exports.listApps = listApps;
exports.createApp = createApp;
exports.removeApp = removeApp;
exports.regenerate = regenerate;
exports.close = close;