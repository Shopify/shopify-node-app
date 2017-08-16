require('isomorphic-fetch');
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');

const shopifyAuth = require('./routes/shopifyAuth');
const shopifyApiProxy = require('./routes/shopifyApiProxy');
const webhookRouter = require('./routes/webhooks');
const persistentStore = require('./persistentStore');

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
} = process.env;

const shopifyConfig = {
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  scope: ['write_orders, write_products'],
  afterAuth(request, response) {
    //TODO: install webhook
    return response.redirect('/');
  },
};

const app = express();
const isDevelopment = NODE_ENV !== 'production';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: new RedisStore(),
    secret: SHOPIFY_APP_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

app.get('/install', (req, res) => res.render('install'));
app.use('/auth/shopify', shopifyAuth(shopifyConfig));
app.use('/api', shopifyApiProxy);
app.use('/webhooks', webhookRouter);

// Run webpack hot reloading in dev
if (isDevelopment) {
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
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  const staticPath = path.resolve(__dirname, '../assets');
  app.use('/assets', express.static(staticPath));
}

app.get('/', function(request, response) {
  const { session: { shop, accessToken } } = request;
  if (!accessToken) {
    return response.redirect(`/auth/shopify?shop=${request.query.shop}`);
  }

  persistentStore.storeUser({ accessToken, shop }, (err, token) => {
    if (err) {
      return console.error('🔴 Error creating local token', err);
    }

    return response.render('app', {
      title: 'Shopify Node App',
      apiKey: shopifyConfig.apiKey,
      shop: request.session.shop,
      token: token,
    });
  });
});

app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
