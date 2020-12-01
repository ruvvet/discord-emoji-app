// ROUTER FOR ALL 'PROTECTED' ROUTES
// User must be logged in through discord oauth
// in order to access these

// DEPENDENCIES
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE
// this sets the 'validate' function on all protected routes
router.use(validate);
// requires routes in the create/browse routers
router.use('/create', require('./create'));
router.use('/browse', require('./browse'));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
router.get('/', getMain);
router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);
router.put('/selectguild', selectGuild);
router.get('/emojidetails', getEmojiDetails);
router.put('/emojidetails', selectEmoji);
router.get('/adduwumoji', addUwuMojiBot);
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

// just looking at the cookie that they were given by us
// the value of "uwucookie"
function giveCookie(req, res) {
  res.send(req.cookies[COOKIE]);
}

// gets emojis by guild
// and renders the main page
async function getMain(req, res) {
  // get emojis currently in the guild

  //////// OR USE THE BOT TO GET ALL EMOJIS LATER - ANYWAYS

  const allGuilds = await oauth
    .getUserGuilds(req.discord_token)
    .catch(() => null);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);

  let emojisByGuild = {};

  guilds.forEach((guild) => {
    // call the bot
    const guildEmojis = bot.getGuildEmoji(guild.id);
    emojisByGuild[guild.name] = guildEmojis;
  });

  res.render('index', { emojisByGuild });
}

// Gets the user's profile details
async function getUserDetails(req, res) {
  const user = await oauth.getUser(req.discord_token);
  // user pfp = avatars/user_id/user_avatar.png **
  res.send({ user });
}

// Gets all the guilds the user is an owner of
async function getUserGuilds(req, res) {
  const allGuilds = await oauth
    .getUserGuilds(req.discord_token)
    .catch(console.log);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);
  res.send({ guilds });
}

async function selectGuild(req, res) {
  const botGuilds = bot.getAllGuilds();

  if (!botGuilds.includes(req.body.guildID)) {
    console.log('bad');
    res.redirect('./error/adduwumoji');
    //TODO: ?????????????????????????????????????????????????
  } else {
    console.log('ok');

    const updateUserSelectedGuild = await db.user
      .update(
        { selected_guild: req.body.guildID },
        { where: { access_token: req.cookies[COOKIE] } }
      )
      .catch(() => null);
    bot.getAllGuilds();
    res.send();
  }
}

async function selectEmoji(req, res) {
  const updateUserSelectedEmoji = await db.user
    .update(
      { selected_emoji: req.body.id },
      { where: { access_token: req.cookies[COOKIE] } }
    )
    .catch(() => null);

  res.send(updateUserSelectedEmoji);
}

async function getEmojiDetails(req, res) {
  const user = await db.user
    .findOne({
      where: { access_token: req.cookies[COOKIE] },
    })
    .catch(() => null);

  if (!user.selected_emoji) {
    res.send('');
  } else {
    const emojiDetails = bot.getEmoji(user.selected_emoji);
    res.send(emojiDetails);
  }
}

function addUwuMojiBot(req, res) {
  res.render('./error/adduwumoji');
}

// clears the cookie
// will "logout" the user
function logout(req, res) {
  res.clearCookie(COOKIE);
  res.redirect('/');
}

module.exports = router;
