// Router for all routes to create/upload a new emoji
// Routes through 'protected'

const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');





router.get('/', upload);


function upload(req, res){
    res.render('create/upload')
}







module.exports = router;