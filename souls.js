const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const models = require('./models');

// Environment Variables
const port = process.env.PORT || 1254;
const sessionSecret = process.env.SESSION_SECRET || 'fuck santa';
const env = process.env.NODE_ENV;

const githubClientId = process.env.GITHUB_CLIENT_ID || '';
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || '';
const githubCbUrl = `${process.env.HOSTNAME || `http://localhost:${port}`}/auth/github/callback`;
const githubParams = { scope: ['user'] };

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const googleCbUrl = `${process.env.HOSTNAME || `http://localhost:${port}`}/auth/google/callback`;
const googleParams = { scope: ['profile'] };

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
  passReqToCallback: true,
}, githubCb);

const googleStrategy = new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: googleCbUrl,
  passReqToCallback: true,
}, googleCb);

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
passport.use(googleStrategy);

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
  res.sendFile(path.join(`${__dirname}/templates/dashboard.html`));
});

app.get('/connect/github', passport.authorize('github', githubParams));
app.get('/connect/github/callback', passport.authorize('github', { failureRedirect: '/account' }));

app.get('/connect/google', passport.authorize('google', googleParams));
app.get('/connect/google/callback', passport.authorize('google', { failureRedirect: '/account' }));

app.get('/auth/github', passport.authenticate('github', githubParams));
app.get('/auth/github/callback', passport.authenticate('github', { 
  successRedirect: '/', 
  failureRedirect: '/login',
}));

app.get('/auth/google', passport.authenticate('google', googleParams));
app.get('/auth/google/callback', passport.authenticate('google', { 
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

function githubCb(req, accessToken, refreshToken, profile, done) {
  const { user } = req;
  if (!user) {
    // Not logged in. Authenticate via Github
    const { displayName, id } = profile;
    const query = { 'github.id': id };
    const data = { displayName, github: profile };

    models.soul.findOrCreate(query, data, (err, soul) => {
      if (err) {
        done(err, soul);
      }

      const update = {
        lastLogin: Date.now(),
        'github.accessToken': accessToken,
        'github.refreshToken': refreshToken,
      };

      const options = {
        new: true,
        upsert: true,
      };

      models.soul.findByIdAndUpdate(soul.id, update, options, done);
    });
  } else if (user && !user.github) {
    // Logged in and Github not connection
    const update = {
      github: profile,
    };

    const options = {
      new: true,
      upsert: true,
    };

    models.soul.findByIdAndUpdate(user.id, update, options, done);
  } else {
    // Logged in and GitHub already connected.
    done(null, req.user);
  }
}

function googleCb(req, accessToken, refreshToken, profile, done) {
  const { user } = req;
  if (!user) {
    // Not logged in. Authenticate via Github
    const { displayName, id } = profile;
    const query = { 'google.id': id };
    const data = { displayName, google: profile };

    models.soul.findOrCreate(query, data, (err, soul) => {
      if (err) {
        done(err, soul);
      }

      const update = {
        lastLogin: Date.now(),
        'google.accessToken': accessToken,
        'google.refreshToken': refreshToken,
      };

      const options = {
        new: true,
        upsert: true,
      };

      models.soul.findByIdAndUpdate(soul.id, update, options, done);
    });
  } else if (user && !user.google) {
    // Logged in and Github not connection
    const update = {
      google: profile,
    };

    const options = {
      new: true,
      upsert: true,
    };

    models.soul.findByIdAndUpdate(user.id, update, options, done);
  } else {
    // Logged in and GitHub already connected.
    done(null, req.user);
  }
}

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}