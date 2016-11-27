const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const debug = require('debug')('souls');
const RedisStore = require('connect-redis')(session);
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

const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY || '';
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET || '';
const twitterCbUrl = `${process.env.HOSTNAME || `http://localhost:${port}`}/auth/twitter/callback`;

const facebookAppId = process.env.FACEBOOK_APP_ID || '';
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || '';
const facebookCbUrl = `${process.env.HOSTNAME || `http://localhost:${port}`}/auth/facebook/callback`;
const facebookParams = { authType: 'rerequest', scope: ['user_friends', 'email', 'public_profile'] };

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
}, handleOAuth);

const googleStrategy = new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: googleCbUrl,
  passReqToCallback: true,
}, handleOAuth);

const twitterStrategy = new TwitterStrategy({
  consumerKey: twitterConsumerKey,
  consumerSecret: twitterConsumerSecret,
  callbackURL: twitterCbUrl,
  passReqToCallback: true,
}, handleOAuth);

const facebookStrategy = new FacebookStrategy({
  clientID: facebookAppId,
  clientSecret: facebookAppSecret,
  callbackURL: facebookCbUrl,
  passReqToCallback: true,
  profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link'],
}, handleOAuth);

const app = express();

mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('development' === env ? 'dev' : 'combined'));
app.use(helmet());
app.use(session({
  resave: false,
  secret: sessionSecret,
  saveUninitialized: false,
  store: new RedisStore({ host: 'localhost', port: 6379 }),
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(ghStrategy);
passport.use(googleStrategy);
passport.use(twitterStrategy);
passport.use(facebookStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  models.soul.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Special Routes
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

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/profile', ensureAuth, (req, res) => {
  res.json(req.user);
});

app.get('/disconnect/:provider', ensureAuth, (req, res) => {
  const provider = req.params.provider;
  debug(provider);

  if (provider && {} !== provider && 'google' !== provider) {
    models.soul.findById(req.user.id, (err, soul) => {
      if (soul) {
        soul[provider] = undefined; // eslint-disable-line no-param-reassign
        soul.save((err) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        debug('object returned');
      }
    });
  }
  res.redirect('/');
});

/**
 * Authorization Routes
 */

app.get('/connect/github', passport.authorize('github', githubParams));
app.get('/connect/github/callback', passport.authorize('github', { failureRedirect: '/account' }));

app.get('/connect/twitter', passport.authorize('twitter'));
app.get('/connect/twitter/callback', passport.authorize('twitter', { failureRedirect: '/account' }));

app.get('/connect/facebook', passport.authorize('facebook', facebookParams));
app.get('/connect/facebook/callback', passport.authorize('facebook', { failureRedirect: '/account' }));

app.get('/connect/google', passport.authorize('google', googleParams));
app.get('/connect/google/callback', passport.authorize('google', { failureRedirect: '/account' }));

/**
 * Authentication Routes
 */

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
  debug(`Listening on port ${port}`);
});

/**
 * Functions
 */

function handleOAuth(req, accessToken, refreshToken, profile, done) {
  const { provider } = profile;

  const props = {
    lastUpdated: Date.now(),
  };

  if ('twitter' === provider) {
    // Handle different OAuth1a signature
    props.token = accessToken;
    props.tokenSecret = refreshToken;
  } else {
    props.accessToken = accessToken;
    props.refreshToken = refreshToken;
  }

  const options = {
    new: true,
    upsert: true,
  };

  if (!req.user) {
    // Not logged in.
    const { displayName, id } = profile;

    const query = {};
    query[`${provider}.id`] = id;

    // Find or Create
    models.soul.findOne(query, (err, soul) => {
      if (err) { done(err, soul); }

      if (soul) {
        // Update soul and return, if found
        const update = {
          lastLogin: Date.now(),
        };
        update[provider] = Object.assign(profile, props);

        models.soul.findByIdAndUpdate(soul.id, update, options, done);
      } else {
        // Create new soul, if not found
        const data = { displayName };
        data[provider] = Object.assign(profile, props);

        models.soul.create(data, done);
      }
    });
  } else {
    // Logged in
    const update = {};
    update[provider] = Object.assign(profile, props);

    models.soul.findByIdAndUpdate(req.user.id, update, options, done);
  }
}

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}