// DEPENDENCIES

require('dotenv').config();

const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('//filelocationhere');
const flash = require('connect-flash');

// APP
const app = express();

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

















app.listen(process.env.PORT || 7000);

// const server = app.listen(PORT);
// module.exports = server;