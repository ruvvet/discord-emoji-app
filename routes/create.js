// ROUTER FOR ALL ROUTES TO CREATE/UPLOAD A NEW EMOJI
// ROUTES THROUGH 'PROTECTED' ROUTES'

// DEPENDENCIES
require('dotenv').config();
const bot = require('../bot');
const cloudinary = require('cloudinary');
const db = require('../models');
const multer = require('multer');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE
const uploads = multer({ dest: './uploads' });

// ROUTES
router.get('/', upload);
router.post('/', uploads.single('emojiFile'), update);
router.get('/myemojis', getUserEmoji);

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
    const guildid = '781353966574370816';

    bot.addEmoji(guildid, result.url, req.body.emojiName);

    const user = await db.user.findOne({
      where: { access_token: req.cookies[COOKIE] },
    });

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

  //   userEmoji.forEach(emoji=>{
  //     console.log(emoji.url)
  // })
}

module.exports = router;
