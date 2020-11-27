// PUBLIC ROUTES
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// THIS IS THE PAGE THEY "SEE" AFTER AUTHORIZING/LOGGING IN
// THIS PAGE SHOULD ONLY HANDLE LOGIN/OAUTH CREDENTIALS
router.get('/callback', oauthCallback);
router.get('/login', authorize);

// route handler
// split route + functions
router.get('/', giveCookie);

// sends back the cookie
function giveCookie(req, res) {
  res.send(req.cookies[COOKIE]);
}

async function oauthCallback(req, res) {
  console.log(req.query.code);
  // We exchange code for access token
  const user = await oauth
    .tokenRequest({
      code: req.query.code,
      scope: 'identify email guilds',
      grantType: 'authorization_code',
    })
    .catch(console.log);

  const maxAge = 30 * 24 * 60 * 60 * 1000; // this is 30 days
  // send a cookie here that contains their access_token for example (temp)
  res.cookie(COOKIE, user.access_token, { maxAge });

  // find or create user in the db
  const [userdb, created] = await db.user.findOrCreate({
    where: {
      access_token: user.access_token,
    },
    defaults: {
      expires_in: user.expires_in,
      refresh_token: user.refresh_token,
      date_visited: Date.now(),
    },
  });

  res.redirect('/');

  // if logged in
  // check if token will expire soon
  // request refresh token
  //then update access token with refresh token???????????
}



function authorize (req, res){

    res.render('login');
}


module.exports = router;
