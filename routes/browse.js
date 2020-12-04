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
router.get('/', browseUwuMoji);
router.get('/discord', browseDiscord);
router.get('/emojigg', browseEmojiGG);
router.post('/', addEmoji);
router.get('/emojiggcategory', getEmojiGGcat)
router.get('/emojigg/:category', browseCategory);

// FUNCTIONS




async function browseUwuMoji (req, res){

  allemoji = await db.emoji
    .findAll()
    .catch(() => null);


  res.render('browse/showuwumoji', {allemoji, libname: 'UwuMoji'});

}


function browseDiscord (req, res){


allemoji = bot.getAllEmoji();
console.log(allemoji)
  res.render('browse/showuwumoji', {allemoji, libname: 'Discord'});

}



//Need to Paginate
//TODO: PAGINATE
// TODO: HAVE A CATEGORIES NAV BAR

// Use emoji.gg api to get all emoji and displays them
async function browseEmojiGG(req, res) {
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    res.render('browse/showemojigg', { allemoji: allemoji.data.slice(0, 200), libname: 'Emoji.gg' });
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
    res.render('browse/showemojigg', { allemoji: emojiByCategory, libname: 'Emoji.gg'});
  }
}

// calls the emojigg api to get all their categories
async function getEmojiGGcat (req, res){
  const emojiGGcat = await axios.get('https://emoji.gg/api?request=categories').catch(() => null);
  res.send(emojiGGcat.data)
}





// calls the bot to add an emoji to the guild its in
// passes 4 arguments, guildid(str), channelid(str), imageurl(str), name(str)
async function addEmoji(req, res) {

  const guildID = req.user.selected_guild;
  bot.addEmoji(guildID, req.body.url, req.body.name);
  res.redirect('/');
}





module.exports = router;