require('dotenv').config();
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const shopifyAuth = require('./routes/shopifyAuth');
const shopifyApiProxy = require('./routes/shopifyApiProxy');
const persistentStore = require('./persistentStore');

const shopifyConfig = {
  host: process.env.SHOPIFY_APP_HOST,
  apiKey: process.env.SHOPIFY_APP_KEY,
  secret: process.env.SHOPIFY_APP_SECRET,
  scope: ['write_orders, write_products'],
  afterAuth(request, response) {
    // do stuff like register webhooks here //
    return response.redirect('/');
  }
}

const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));

app.get('/install',  function(req, res) {
  res.render('install')
})

app.use('/auth/shopify', shopifyAuth(shopifyConfig));

app.use('/api', shopifyApiProxy);

// Run webpack hot reloading in dev
if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(__dirname + '/assets'))
}

app.get('/', function(request, response) {
    const {session: {shop, access_token: apiToken}} = request;
    if (!apiToken) {
      response.redirect(`/auth/shopify?shop=${request.query.shop}`);
    }

    persistentStore.storeUser({apiToken, shop}, (err, userId) => {
      if (err) {
        return console.error('🔴 Error creating local token', err);
      }

      return response.render('app', {
        title: 'Shopify Node App',
        apiKey: shopifyConfig.apiKey,
        shop: request.session.shop,
        userId: userId,
      });
    });
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
