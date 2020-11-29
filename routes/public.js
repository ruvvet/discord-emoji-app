// ROUTER FOR ALL 'PUBLIC' ROUTES
// User does not need to be logged in

// DEPENDENCIES
const db = require('../models');
const router = require('express').Router();
const { COOKIE, oauth } = require('../constants');

// ROUTES
// they should only 'see' these for logging in/handling oauth cred
router.get('/callback', oauthCallback);
router.get('/login', authorize);

// creates a token request for user
// once logged in via oauth sets the cookie
// and creates the user in the db
async function oauthCallback(req, res) {
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
  //then update access token with refresh token
}


// renders the login page
// clicking the login button will direct to the callback
function authorize (req, res){
    res.render('login');
}


module.exports = router;
