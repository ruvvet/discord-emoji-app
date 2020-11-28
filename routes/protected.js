// ROUTER FOR ALL 'PROTECTED' ROUTES
// User must be logged in through discord oauth
// in order to access these

// DEPENDENCIES
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE
// this sets the 'validate' function on all protected routes
router.use(validate);
// requires routes in the create/browse routers
router.use('/create', require('./create'));
router.use('/browse', require('./browse'));

// ROUTES
router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);
router.get('/logout', logout);

// FUNCTIONS
// Middleware - Validation
// Checks if user has a cookie.
// if no cookie, redirect to login
function validate(req, res, next) {
  if (req.cookies[COOKIE]) {
    req.discord_token = req.cookies[COOKIE];
    next();
  } else {
    res.redirect('/login');
  }
}

// Gets the user's profile details
async function getUserDetails(req, res) {
  const user = await oauth.getUser(req.discord_token);
  console.log(user);
  // user pfp = avatars/user_id/user_avatar.png **
  res.render('profile/profile', { user });
}

// Gets all the guilds the user is an owner of
async function getUserGuilds(req, res) {
  console.log(req.discord_token);
  const guilds = await oauth
    .getUserGuilds(req.discord_token)
    .catch(console.log);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guild_owner = guilds.filter((guild) => guild.owner);
  res.render('profile/guilds', { guild_owner });
}

// clears the cookie
// will "logout" the user
function logout(req, res) {
  res.clearCookie(COOKIE);
  res.redirect('/');
}

module.exports = router;
