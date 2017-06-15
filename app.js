const express = require('express');
const passport = require('passport');

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const shopifyAuth = require('./routes/shopifyAuth');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use('/auth/shopify/', shopifyAuth({
  host: 'http://localhost:3000',
  apiKey: 'e83fbb0a19687cc6701eeb3ccdccb38c',
  secret: '01a9b5f3e112808a868308c2bbf33dfe',
  scope: ['write_orders, write_products'],
  afterAuth: (request, response, shop) => {
    // do stuff like register webhooks
    return response.redirect('/app')
  }
}));

// need to get the user session back here.
app.get('/app', function(req, res, next) {
  debugger
  res.render('app', { title: 'Shopify Node App' });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;
