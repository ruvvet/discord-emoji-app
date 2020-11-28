// ROUTER FOR ALL ROUTES TO CREATE/UPLOAD A NEW EMOJI
// ROUTES THROUGH 'PROTECTED' ROUTES'

// DEPENDENCIES
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// MIDDLEWARE

// ROUTES
router.get('/', upload);

// FUNCTIONS
function upload(req, res) {
  res.render('create/upload');
}

module.exports = router;
