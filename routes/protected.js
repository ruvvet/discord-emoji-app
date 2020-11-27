const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// setting the middleware on all protected routes
router.use(validate);
// routes
router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);
router.get('/logout', logout);

// creating the middleware
// checks for a cookie, if not > redir
function validate(req, res, next) {
  if (req.cookies[COOKIE]) {
    req.discord_token = req.cookies[COOKIE];
    next();
  } else {
    res.redirect('/login');
  }
}

async function getUserDetails(req, res) {
  const user = await oauth.getUser(req.discord_token);
console.log(user);
  // user pfp = avatars/user_id/user_avatar.png **
  res.render('profile/profile', { user });
}

// GET ALL GUILDS USER IS AN OWNER OF
async function getUserGuilds(req, res) {
  console.log(req.discord_token);
  const guilds = await oauth
    .getUserGuilds(req.discord_token)
    .catch(console.log);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guild_owner = guilds.filter((guild) => guild.owner);
  res.render('profile/guilds', { guild_owner });

  //[{"id":"122579072046989316","name":"Slutty Bunnies","icon":"2615f0af4e9de960a9626cc30a1fbf8a","owner":true,"permissions":2147483647,"features":[],"permissions_new":"2147483647"},{"id":"781353966574370816","name":"UwuMoji Test Server","icon":"1487de4557002d85b8c692d04e1c53e4","owner":true,"permissions":2147483647,"features":[],"permissions_new":"2147483647"}]
}

function logout(req, res) {
  // LOGGING OUT DELETES THE COOKIE
  res.clearCookie(COOKIE);
  res.redirect('/');
}














module.exports = router;
