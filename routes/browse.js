// ROUTER FOR EVERYTHING RELATED TO BROWSING PRE-EXISTING EMOJI LIB
// ROUTES THROUGH 'PROTECTED' ROUTES

// DEPENDENCIES
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
router.get('/', browseAll);
router.post('/', addEmoji);
router.get('/:category', browseCategory);

// FUNCTIONS


//Need to Paginate
//TODO: PAGINATE
// TODO: HAVE A CATEGORIES NAV BAR

// Use emoji.gg api to get all emoji and displays them
async function browseAll(req, res) {
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    res.render('browse/show', { allemoji: allemoji.data.slice(0, 200) });
  }
}


// Gets emoji by category (#) for emoji.gg api
async function browseCategory(req, res) {
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    const emojiByCategory = allemoji.data.filter(
      (emoji) => emoji.category == req.params.category
    );
    res.render('browse/show', { allemoji: emojiByCategory });
  }
}

// calls the bot to add an emoji to the guild its in
// passes 4 arguments, guildid(str), channelid(str), imageurl(str), name(str)
function addEmoji(req, res) {
// TODO: GET GUILDID AND SET ON THE COOKIE OR SET IT SOMEWHERE
// put it in the db/cookie
  const guildid = '781353966574370816';

  bot.addEmoji(guildid, req.body.url, req.body.name);
  res.redirect('/');
}

module.exports = router;