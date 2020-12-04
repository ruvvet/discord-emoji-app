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
router.put('/edit/name', editEmojiName);
router.put('/edit/tags', editEmojiTags);
router.get('/tags', getEmojiTags);
router.delete('/delete', deleteEmoji);

router.get('/tags', tagsTest);

function tagsTest(req, res) {
  res.render('create/tags-test');
}

// FUNCTIONS

//renders the upload page
function upload(req, res) {
  res.render('create/upload');
}

// uploads to cloudinary and updates the db
function update(req, res) {
  const file = req.file.path;

  // upload to cloudinary, then call the bot

  cloudinary.uploader.upload(file, async (result) => {
    const guildID = req.user.selected_guild;

    bot.addEmoji(guildID, result.url, req.body.emojiName);

    const user = await db.user
      .findOne({ where: { uuid: req.user.uuid } })
      .catch(() => null);

    // find or create emoji in the db
    const [newemoji, created] = await db.emoji.findOrCreate({
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
  const user = await db.user
    .findOne({ where: { uuid: req.cookies[COOKIE] } })
    .catch(() => null);

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

  if (!req.user.selected_emoji) {
    res.render('create/edit', { emojiData: {} });
    //res.redirect('/');
  } else {
    const emojiData = bot.getEmoji(req.user.selected_emoji);
    res.render('create/edit', { emojiData }); // render can only send primitive types - like obj
  }
}

function editEmojiName(req, res) {
  bot.updateEmoji(req.body.id, req.body.name);
  res.redirect('/');
}

async function getEmojiTags(req, res) {

  const emojiTags = db.tag.findAll({
    where: {discord_emoji: req.body.id}
  }).catch(()=>null)

   res.send(emojiTags)
}

// update the emojis tags in the db
function editEmojiTags(req, res) {
  // get the list of tags
  // and find/create them into the db
  const tags = req.body.tags.split(',');

  tags.forEach(async (tag) => {
    const [newtag, created] = await db.tag
      .findOrCreate({
        where: {
          name: tag,
        },
        defaults: {
          discord_emoji: req.body.id,
        },
      })
      .catch(() => null);
  });
}

// calls the bot to delete an emoji
async function deleteEmoji(req, res) {
  //bot deletes emoji
  bot.deleteEmoji(req.body.emojiID);

  // db resets to null
  await db.user
    .update({ selected_emoji: null }, { where: { uuid: req.user.uuid } })
    .catch(() => null);

  res.redirect('/');
}

module.exports = router;
