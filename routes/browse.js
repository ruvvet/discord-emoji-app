// Router for all routes to brose emoji and add to a guild
// Routes through 'protected'
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', browseAll);
router.post('/', addEmoji);
router.get('/:category', browseCategory);

async function browseAll(req, res) {
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    res.render('browse/show', { allemoji: allemoji.data.slice(0, 100) });
  }
}

async function browseCategory(req, res) {
  console.log(req.params);
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

function addEmoji(req, res) {
    console.log('in the post route')
    console.log(req.body)

    // const url = req.body.url;
    // const name = req.body.name;
    // need to do guildid lookup
  const guildid = '781353966574370816';
  bot.addemoji(guildid, req.body.url, req.body.name);
  res.redirect('/');
}

module.exports = router;

// add fetch to ejs page
// that adds a post to route
// onclick, use the function
// use an event listener instead of form
