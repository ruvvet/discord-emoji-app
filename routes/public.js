// ROUTER FOR ALL 'PUBLIC' ROUTES
// User does not need to be logged in

// DEPENDENCIES
const db = require('../models');
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { COOKIE, oauth } = require('../constants');

// ROUTES
// they should only 'see' these for logging in/handling oauth cred
router.get('/callback', oauthCallback);
router.get('/login', login);
router.get('/authorize', authorize);

// creates a token request for user
// once logged in via oauth sets the cookie
// and creates the user in the db
async function oauthCallback(req, res) {
  // We exchange code for access token
  const userAuth = await oauth
    .tokenRequest({
      code: req.query.code,
      scope: 'identify email guilds bot',
      grantType: 'authorization_code',
    })
    .catch(console.log);

  //look up the discord id
  const userInfo = await oauth.getUser(userAuth.access_token);

  // calculate the expiration
  let now = new Date().getTime();
  let expiryDate = now + 1000 * userAuth.expires_in;

  // find or create user in the db
  const [user, created] = await db.user.findOrCreate({
    where: {
      // this should be discord id
      discord_id: userInfo.id,
    },
    defaults: {
      username: userInfo.username,
      uuid: uuidv4(),
      access_token: userAuth.access_token,
      expiry: expiryDate,
      refresh_token: userAuth.refresh_token,
      date_visited: Date.now(),
    },
  });

  if (!created) {
    await db.user
      .update(
        {
          access_token: userAuth.access_token,
          expiry: userAuth.expires_in,
          refresh_token: userAuth.refresh_token,
        },
        { where: { uuid: user.uuid } }
      )
      .catch(() => null);
  }

  const maxAge = 30 * 24 * 60 * 60 * 1000; // this is 30 days

  // send a cookie here that contains their uuid
  res.cookie(COOKIE, user.uuid, { maxAge });

  res.redirect('/');

  // if logged in
  // check if token will expire soon
  // request refresh token
  //then update access token with refresh token
}

// renders the login page
// clicking the login button will direct to the callback
function login(req, res) {
  res.render('login');
}

function authorize(req, res) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=1074260032&redirect_uri=${process.env.OAUTH_CALLBACK}&response_type=code&scope=identify%20email%20guilds%20bot`


  );
}

module.exports = router;

//TODO:
// user logs in + authorizes
// then i get the users discord id
// update the db
// create the uuid - this becomes the primary key
// uuid = cookie value

// when they logout + cookie is cleared
//login,
// what is your discord id
//look up in db
// send a new cookie with uuid as cookie

// user logs in
// i get their access token
// hash their access token
// this is the cookie value

// compare(cookie, hash(access_token))
