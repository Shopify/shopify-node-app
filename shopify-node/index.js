const express = require('express');

const shopifyAuthRouter = require('./routes/shopifyAuth');
const shopifyApiProxy = require('./routes/shopifyApiProxy');

const withShop = require('./middleware/withShop');
const withWebhook = require('./middleware/webhooks');

const shopStore = require('./shopStore');

module.exports = {
  withShop: withShop,
  withWebhook: withWebhook,
  shopStore: shopStore
};

module.exports.shopifyRouter = function(shopifyConfig) {
  const router = express.Router();

  router.use('/auth/shopify', shopifyAuthRouter(shopifyConfig));
  router.use('/api', withShop({ redirect: false }), shopifyApiProxy);

  return router
};
