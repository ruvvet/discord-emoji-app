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

router.post('/', uploads.single('emojiFile'), (req, res) => {
  console.log(req.cookies[COOKIE])
  // const name = req.body.emojiName;
  const file = req.file.path;

  // upload to cloudinary, then call the bot

  cloudinary.uploader.upload(file, async (result) => {
    const guildid = '781353966574370816';

    bot.addEmoji(guildid, result.url, req.body.emojiName);

    // find or create emoji in the db
    const [emojidb, created] = await db.emoji.findOrCreate({
      where: {
        name: req.body.emojiName,
        url: result.url,
      },
      defaults: {
        userId: 1,
      },
    });
    res.redirect('/');
  });
});

// FUNCTIONS
function upload(req, res) {
  res.render('create/upload');
}

module.exports = router;
