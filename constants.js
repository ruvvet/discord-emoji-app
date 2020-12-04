// CONSTANTS
// These are all the constants used throughout the code
// This can be required and used by any modules

const DiscordOauth = require('discord-oauth2');

// THE COOKIE
const COOKIE = 'uwucookie';

// OBJ CONTAINING CLIENT ID + SECRET FOR DISCORD OAUTH
const oauth = new DiscordOauth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.OAUTH_CALLBACK,
});

module.exports = { COOKIE, oauth };
