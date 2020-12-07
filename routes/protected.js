// ROUTER FOR ALL 'PROTECTED' ROUTES
// TO ACCESS, USER MUST BE LOGGED IN

// DEPENDENCIES //////////////////////////////////////////////////////////
const qs = require('qs');
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');
const { Sequelize } = require('../models');

// MIDDLEWARE ////////////////////////////////////////////////////////////
// this sets the 'validate' function on all protected routes
router.use(validate);
// requires routes in the create/browse routers
router.use('/create', require('./create'));
router.use('/browse', require('./browse'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////
//router.get('/refresh', checkToken);
router.get('/', getMain);
router.get('/emoji/:emojiid', selectEmojiByID);
router.get('/emoji/:emojiid/edit', editEmojiByID);
router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);
router.put('/selectguild', selectGuild);
router.get('/emojidetails', getEmojiDetails);
router.put('/emojidetails', selectEmoji);
router.get('/adduwumoji', addUwuMojiBot);
router.get('/logout', logout);

//testing cookies
router.get('/clearcookie', clearCookies);

// FUNCTIONS /////////////////////////////////////////////////////////////
// Middleware - Validation
// Checks if user has a cookie.
// if no cookie, redirect to login
async function validate(req, res, next) {
  // step 1, check if they have a cookie
  if (req.cookies[COOKIE]) {
    // step 2, find the user

    const user = await db.user
      .findOne({ where: { uuid: req.cookies[COOKIE] } })
      .catch(() => null);

    if (user) {
      // set req.user as the user details obj
      req.user = user;

      // check expiration date
      // if the expiration date is 1 day away from current date
      // refresh the token
      const expirationDate = new Date(parseInt(req.user.expiry));
      const daysUntilExpire =
        (req.user.expiry - new Date().getTime()) / 1000 / 60 / 60 / 24;

      if (daysUntilExpire < 1) {
        refreshToken(req.user);
      }
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
}

// function that refreshes the token
async function refreshToken(user) {
  // make an api post call to discord with the client credentials
  // this returns a new access token + refresh token
  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: user.refresh_token,
  };

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  const newToken = await axios({
    method: 'post',
    url: 'https://discord.com/api/oauth2/token',
    data: qs.stringify(data),
    headers,
  }).catch((error) => console.log(error.response.request._response));

  // calculate the expiration
  let now = new Date().getTime();
  let expiryDate = now + 1000 * newToken.data.expires_in;

  await db.user
    .update(
      {
        access_token: newToken.data.access_token,
        expiry: expiryDate,
        refresh_token: newToken.data.refresh_token,
      },
      { where: { uuid: user.uuid } }
    )
    .catch(() => null);
}

// gets emojis by guild
// and renders the main page
async function getMain(req, res) {
  // get emojis currently in the guild

  const allGuilds = await oauth
    .getUserGuilds(req.user.access_token)
    .catch(() => []);

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
  const user = await oauth.getUser(req.user.access_token);
  // user pfp = avatars/user_id/user_avatar.png **
  res.send({ user });
}

// Gets all the guilds the user is an owner of
async function getUserGuilds(req, res) {
  const allGuilds = await oauth
    .getUserGuilds(req.user.access_token)
    .catch(() => []);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);
  res.send({ guilds });
}

async function selectGuild(req, res) {
  const botGuilds = bot.getAllGuilds();

  if (!botGuilds.includes(req.body.guildID)) {
    res.status(400).send('bot not in guild');
  } else {
    const updateUserSelectedGuild = await db.user
      .update(
        { selected_guild: req.body.guildID },
        { where: { uuid: req.user.uuid } }
      )
      .catch(() => null);
    bot.getAllGuilds();
    res.send();
  }
}

async function selectEmoji(req, res) {
  const updateUserSelectedEmoji = await db.user
    .update({ selected_emoji: req.body.id }, { where: { uuid: req.user.uuid } })
    .catch(() => null);

  res.send(updateUserSelectedEmoji);
}

async function getEmojiDetails(req, res) {
  if (!req.user.selected_emoji) {
    res.send('');
  } else {
    const emojiData = bot.getEmoji(req.user.selected_emoji);
    res.send(emojiData);
  }
}

async function selectEmojiByID(req, res) {
  // get emojis currently in the guild

  const allGuilds = await oauth
    .getUserGuilds(req.user.access_token)
    .catch(() => []);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);

  let emojisByGuild = {};

  guilds.forEach((guild) => {
    // call the bot
    const guildEmojis = bot.getGuildEmoji(guild.id);
    emojisByGuild[guild.name] = guildEmojis;
  });

  const emojiData = bot.getEmoji(req.params.emojiid);

  res.render('index-emoji', {
    emojisByGuild,
    emojiID: req.params.emojiid,
    emojiData,
  });
}

async function editEmojiByID(req, res) {
  const emojiData = bot.getEmoji(req.params.emojiid);

  const emojiTags = await db.tag
    .findAll({
      where: { discord_emoji: req.params.emojiid },
    })
    .catch(console.error);

  res.render('create/edit', { emojiData, emojiTags });
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

function clearCookies(req, res) {
  console.log(req.cookies);
  res.send('cleared');
}

// just looking at the cookie that they were given by us
// the value of "uwucookie"
function giveCookie(req, res) {
  res.send(req.cookies[COOKIE]);
}

module.exports = router;

//TODO:main index page - animated vs non-animated emoji slots available
//
// bot still sends message even if you cant add anymore
//TODO: kind of weird logic for the math.ceil in the browse pagination
//TODO: categories browse is broken???
// TODO: guild "selection"
