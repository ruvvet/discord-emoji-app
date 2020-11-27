// DEPENDENCIES

require('dotenv').config();

const { COOKIE } = require('./constants');
const cookie = require('cookie-parser');
const ejs = require('ejs');
const express = require('express');
const layouts = require('express-ejs-layouts');
const routes = require('./routes');

// APP
const app = express();

// MIDDLEWARE
app.use(cookie());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.set('layout', './layout')


app.use('/', routes);

app.listen(process.env.PORT || 5000);
