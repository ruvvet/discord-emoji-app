// Router for all routes to brose emoji and add to a guild
// Routes through 'protected'
const axios = require('axios');
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

router.get('/', browse);

async function browse(req, res) {

    const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);
    if (!allemoji){
        //res.render(404)
        console.log('error with getting emoji')
    } else {

        res.render('browse/allemoji', {allemoji: allemoji.data.slice(0,50)});
    }

}

module.exports = router;
