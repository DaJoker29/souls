const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const models = require('./models');

// Environment Variables
const port = process.env.PORT || 1254;
const sessionSecret = process.env.SESSION_SECRET || 'fuck santa';
const githubClientId = process.env.GITHUB_CLIENT_ID || '';
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || '';
const githubCbUrl = `${process.env.HOSTNAME || `http://localhost:${port}`}/auth/github/callback`;
const env = process.env.NODE_ENV;

/**
 * Souls - Personalized Users
 * @module  souls
 */
console.log('Abandon all hope...');

/**
 * Configuration
 */

const ghStrategy = new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: githubCbUrl,
}, githubCb);

const app = express();

mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('development' === env ? 'dev' : 'combined'));
app.use(session({
  resave: false,
  secret: sessionSecret,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(ghStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  models.soul.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Routes
 */

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(`${__dirname}/templates/login.html`));
  }
});

app.get('/', ensureAuth, (req, res) => {
  res.sendStatus(200);
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user'] }));
app.get('/auth/github/callback', passport.authenticate('github', { 
  successRedirect: '/', 
  failureRedirect: '/login',
}));

/**
 * Start
 */

mongoose.connect('mongodb://localhost/souls');
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * Functions
 */

function githubCb(accessToken, refreshToken, profile, done) {
  const { id, username, displayName } = profile;
  const { email } = profile._json;

  const info = { id, username, displayName, email };
  const query = { 'accounts.github.id': id };
  const data = { displayName, accounts: { github: info } };

  models.soul.findOrCreate(query, data, (err, user) => {
    if (err) {
      done(err, user);
    }

    const update = {
      lastLogin: Date.now(),
      'accounts.github.accessToken': accessToken,
    };

    const options = {
      new: true,
      upsert: true,
    };

    models.soul.findByIdAndUpdate(id, update, options, done);
  });
}

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}