// ROUTER FOR ALL ROUTES TO CREATE/UPLOAD A NEW EMOJI
// ROUTES THROUGH 'PROTECTED' ROUTES'

// DEPENDENCIES
require('dotenv').config();
const bot = require('../bot');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const db = require('../models');
const multer = require('multer');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE
const uploads = multer({ dest: './uploads' });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
router.get('/', upload);
router.post('/', uploads.single('emojiFile'), update);
router.get('/myemojis', getUserEmoji);
router.get('/edit', editEmojiPage);
router.put('/edit', editEmoji);
router.delete('/delete', deleteEmoji);

// FUNCTIONS

//renders the upload page
function upload(req, res) {
  res.render('create/upload');
}

// uploads to cloudinary and updates the db
function update(req, res) {
  //console.log(req.cookies[COOKIE])
  // const name = req.body.emojiName;
  const file = req.file.path;

  // upload to cloudinary, then call the bot

  cloudinary.uploader.upload(file, async (result) => {
    const user = await db.user.findOne({
      where: { access_token: req.cookies[COOKIE] },
    });

    const guildID = user.selected_guild;

    bot.addEmoji(guildID, result.url, req.body.emojiName);

    // find or create emoji in the db
    const [emojidb, created] = await db.emoji.findOrCreate({
      where: {
        name: req.body.emojiName,
        url: result.url,
      },
      defaults: {
        userId: user.id,
      },
    });
    res.redirect('/');
  });
}

// calls the database to get all the emojis the user uploaded
async function getUserEmoji(req, res) {
  const user = await db.user.findOne({
    where: { access_token: req.cookies[COOKIE] },
  });

  const userEmoji = await db.emoji
    .findAll({
      include: [db.user],
      where: { userId: user.id },
    })
    .catch(() => null);

  res.send(userEmoji);
}

// Editing Emojis
async function editEmojiPage(req, res) {
  // exactly the same as getemojidetails from 'protected'
  const user = await db.user
    .findOne({
      where: { access_token: req.cookies[COOKIE] },
    })
    .catch(() => null);

  console.log(user.selected_emoji);

  if (!user.selected_emoji) {
    res.render('create/edit', {emojiData: {} })
     //res.redirect('/');
  } else {
    const emojiData = bot.getEmoji(user.selected_emoji);
    console.log(emojiData)
    res.render('create/edit', { emojiData });
  }
}

function editEmoji(req, res) {
  //bot updates the emoji here
}

// calls the bot to delete an emoji
async function deleteEmoji(req, res) {
  //bot deletes emoji
  bot.deleteEmoji(req.body.guildID, req.body.emojiID, req.body.name);

  // db resets to null
  await db.user
    .update(
      { selected_emoji: null },
      { where: { access_token: req.cookies[COOKIE] } }
    )
    .catch(() => null);

    res.redirect('/')
}

module.exports = router;
