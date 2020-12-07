// ROUTER FOR EVERYTHING RELATED TO BROWSING VARIOUS EMOJI LIB
// THIS ROUTES THROUGH 'PROTECTED' ROUTES
// USERS MUST BE LOGGED IN TO ACCESS THESE

// DEPENDENCIES //////////////////////////////////////////////////////////
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();

// MIDDLEWARE ////////////////////////////////////////////////////////////
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////
router.post('/', addEmoji); // add an emoji
router.get('/', browseUwuMoji); // shows all the "uploaded emoji" that are stored in the database
router.get('/discord', browseDiscord); // calls the bot and displays all the emoji the bot has access to
router.get('/emojigg', browseEmojiGG); //  - NOT IN USE - calls the emoji.gg api and displays all their emoji
router.get('/emojiggcategory', getEmojiGGcat); // gets + sends a list of categories from the emoji.gg api
router.get('/emojigg/:page', browseEmojiggPage); // calls the emoji.gg api and displays all emoji w/ pagination
router.get('/emojigg/category/:cat', browseEmojiggCategory); // calls the emoji.gg api and sorts all emoji by category

// FUNCTIONS /////////////////////////////////////////////////////////////

// Gallery for the uwumoji db - displays the emojis in the database
async function browseUwuMoji(req, res) {
  // calls the database, finds all the emoji in the emoji table
  allemoji = await db.emoji.findAll().catch(() => null);
  // sends it to be displayed on the uwumoji main browse page
  res.render('browse/showuwumoji', { allemoji, libname: 'UwuMoji' });
}

// Gallery for all the discord emoji - displays all the emojis the bot has access to
function browseDiscord(req, res) {
  // calls the bot to get all the emoji it has access to based on which guilds it is in
  allemoji = bot.getAllEmoji();
  // sends it to be displayed on the discord page
  res.render('browse/showuwumoji', { allemoji, libname: 'Discord' });
}

// - NOT IN USE -
// Gallery for all the emoji.gg api emoji
async function browseEmojiGG(req, res) {
  // calls the emoji.gg api to get all the emoji
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    // sends emojis to be displayed
    res.render('browse/showemojigg', {
      allemoji: allemoji.data.slice(0, 200),
      libname: 'Emoji.gg',
    });
  }
}

// Gallery for all the emoji.gg api emoji - but paginated
async function browseEmojiggPage(req, res) {
  // takes a page parameter + parses it to an integer
  // page count starts at 0
  const page = parseInt(req.params.page) || 0;
  const emojisPerPage = 100;

  // use the page value to splice the emoji list - these are the defaults
  let start = page * emojisPerPage;
  let end = start + emojisPerPage;

  // calls the emoji.gg api to get all the emoji
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  // if the page value is less than 0
  // the start is always set at 0
  if (page < 0) {
    start = 0;
    end = start + 100;
  }
  // of the page value is greater than the # of emojis/100 (100 emojis/page)
  // then the end is always -100 the length of the list.
  let lastPage = Math.ceil(allemoji.data.length / emojisPerPage) - 1;

  if (page > lastPage) {
    end = Math.ceil(allemoji.data.length / emojisPerPage) * emojisPerPage;
    start = end - emojisPerPage;
  }

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    // sends emojis to be displayed
    res.render('browse/showemojigg', {
      allemoji: allemoji.data.slice(start, end),
      libname: 'Emoji.gg',
      page,
      end: lastPage,
    });
  }
}

// Gets emoji by category (#) for emoji.gg api
async function browseEmojiggCategory(req, res) {
  // calls the emoji.gg api to get all the emoji
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    // filter the emoji by their category value so it matches the parameter value
    const emojiByCategory = allemoji.data.filter(
      (emoji) => emoji.category == req.params.cat
    );
    // sends the filtered emoji to be displayed
    res.render('browse/showemojigg', {
      allemoji: emojiByCategory,
      libname: 'Emoji.gg',
      page: null,
      end: null,
    });
  }
}

// calls the emojigg api to get all their categories
async function getEmojiGGcat(req, res) {
  const emojiGGcat = await axios
    .get('https://emoji.gg/api?request=categories')
    .catch(() => null);
  // sends it to be displayed in the partial
  res.send(emojiGGcat.data);
}

// calls the bot to add an emoji to the guild its in
async function addEmoji(req, res) {
  // takes the selected guildid
  const guildID = req.user.selected_guild;
  // calls the bot to add an emoji
  // passes 3 arguments - guildid, the url of the image, and the name
  bot.addEmoji(guildID, req.body.url, req.body.name);
  res.redirect('/');
}

module.exports = router;
