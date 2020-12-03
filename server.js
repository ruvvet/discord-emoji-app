// MAIN SERVER FILE

// DEPENDENCIES
require('dotenv').config();

const { COOKIE } = require('./constants');
const cookie = require('cookie-parser');
const ejs = require('ejs');
const express = require('express');
const layouts = require('express-ejs-layouts');
const routes = require('./routes');




var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);






// APP
const app = express();

// MIDDLEWARE

app.set('view engine', 'ejs');
app.set('layout', './layout')
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(cookie());
app.use('/', routes);

// LISTEN
app.listen(process.env.PORT || 5000);
