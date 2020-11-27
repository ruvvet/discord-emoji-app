// Router containing all the "protected" routes
// User must be logged in through discord oauth
// in order to access these

const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// this sets the 'validate' middleware on all protected routes
router.use(validate);
router.use('/create', require('./create'));
router.use('/browse', require('./browse'));

// routes
router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);
router.get('/logout', logout);

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

// gets the user's profile details
async function getUserDetails(req, res) {
  const user = await oauth.getUser(req.discord_token);
console.log(user);
  // user pfp = avatars/user_id/user_avatar.png **
  res.render('profile/profile', { user });
}

// gets all the guilds the user is an owner of
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
