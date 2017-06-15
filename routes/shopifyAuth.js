const express = require('express');
const passport = require('passport');
const ShopifyStrategy = require('passport-shopify').Strategy;

module.exports = function shopifyAuth({host, apiKey, secret, scope, afterAuth}) {
  const router = express.Router();

  passport.serializeUser((shop, done) => done(null, shop.id));

  router.use(passport.initialize());

  router.get('/', (request, response, next) => {
    if (typeof request.query.shop !== 'string') {
      return response.send('request.query.shop was not a string, e.g. /auth/shopify?shop=your-shop-name');
    }

    passport.use(`shopify`, new ShopifyStrategy({
      clientID: apiKey,
      clientSecret: secret,
      callbackURL: `${host}/auth/shopify/callback`,
      shop: request.query.shop,
    }, (accessToken, refreshToken, shop, done) => {
      return done(null, shop)
    }));

    return passport.authenticate(`shopify`, {
      scope: scope,
      shop: request.query.shop,
    })(request, response, next);
  });

  router.get('/callback', (request, response, next) => {
    return passport.authenticate(`shopify`)(request, response, next);
  }, (request, response) => {
    afterAuth(request, response, request.user)
  });

  return router;
}
