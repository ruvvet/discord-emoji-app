// ROUTER FOR ALL ROUTES TO CREATE/UPLOAD A NEW EMOJI
// ROUTES THROUGH 'PROTECTED' ROUTES'
// USERS MUST BE LOGGED IN TO ACCESS THESE

// DEPENDENCIES //////////////////////////////////////////////////////////
require('dotenv').config();
const bot = require('../bot');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const db = require('../models');
const multer = require('multer');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE ////////////////////////////////////////////////////////////
const uploads = multer({ dest: './uploads' });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////
router.get('/', upload); // the upload page
router.post('/', uploads.single('emojiFile'), update); // uploads the file from the multipart-form type
router.get('/edit', editEmojiPage); // page for editing emoji
router.put('/edit/name', editEmojiName); // updates the emoji's name
router.put('/edit/tags', editEmojiTags); // updates the emoji's tags
router.get('/tags', getEmojiTags); // gets all the emoji's tags
router.delete('/delete', deleteEmoji); // deletes an emoji
router.get('/myemojis', getUserEmoji); //gets the user's emojis that were uploaded

// FUNCTIONS /////////////////////////////////////////////////////////////

//renders the upload page
function upload(req, res) {
  res.render('create/upload');
}

// and Uploads the emoji to cloudinary and the guild
function update(req, res) {
  // takes the file from the multipart form in the uploads page
  const file = req.file.path;

  // uploads to cloudinary
  cloudinary.uploader.upload(file, async (result) => {
    // gets the selected guildid
    const guildID = req.user.selected_guild;

    // call the bot to add the emoji
    // sends 3 arguments - guildid, url, name
    bot.addEmoji(guildID, result.url, req.body.emojiName);

    // find the user id in the database based on their uuid
    const user = await db.user
      .findOne({ where: { uuid: req.user.uuid } })
      .catch(() => null);

    // find or create emoji in the db with the user.id as the fk
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
  // find the user id in the database based on their uuid
  const user = await db.user
    .findOne({ where: { uuid: req.cookies[COOKIE] } })
    .catch(() => null);

  // get all the emoji in the db where the user.id = fk
  const userEmoji = await db.emoji
    .findAll({
      include: [db.user],
      where: { userId: user.id },
    })
    .catch(() => null);

  res.send(userEmoji);
}

// renders the edit emoji page
// exactly the same as getemojidetails from 'protected'
async function editEmojiPage(req, res) {
  // i think the first part below might now be superfluous BUT
  // we keeping it anyways for now
  if (!req.user.selected_emoji) {
    res.render('create/edit', { emojiData: {} });
  } else {
    // tells the bot to get the emoji details based on the user's selected emoji
    // bot takes 1 argument, the id of the selected emoji
    const emojiData = bot.getEmoji(req.user.selected_emoji);
    res.render('create/edit', { emojiData }); // render can only send primitive types - like obj
  }
}

// updates an emoji's name
function editEmojiName(req, res) {
  // calls the bot to update an emoji's name based on the id
  // updates it with the new name
  // bot takes 2 arguments, the id of the emoji, and the new name
  // these are passed through the form submission
  bot.updateEmoji(req.body.id, req.body.name);
  res.redirect('/');
}

// get all the tags for an emoji
async function getEmojiTags(req, res) {
  // look up the tags for an emoji based on the emoji id
  const emojiTags = db.tag
    .findAll({
      where: { discord_emoji: req.body.id },
    })
    .catch(() => null);

  res.send(emojiTags);
}

// update the emojis tags in the db
function editEmojiTags(req, res) {
  console.log(req.body.tags);
  // get the list of tags
  const tags = req.body.tags.split(',');

  // and find/create them into the db
  tags.forEach(async (tag) => {
    const [newtag, created] = await db.tag
      .findOrCreate({
        where: {
          name: tag,
          discord_emoji: req.body.id,
        },
      })
      .catch(() => null);
  });
}

// deletes an emoji
async function deleteEmoji(req, res) {
  // calls the bot to delete an emoji
  // takes 1 argument = the emoji id
  bot.deleteEmoji(req.body.emojiID);

  // reset the user's selected emoji to null
  await db.user
    .update({ selected_emoji: null }, { where: { uuid: req.user.uuid } })
    .catch(() => null);

  res.redirect('/');
}

module.exports = router;
