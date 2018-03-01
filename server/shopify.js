const APIClient = require('shopify-api-node');
const {
  createAuth,
  createVerifyAuth,
  createVerifyWebhook,
  apiProxy,
} = require('@shopify/shopify-express');
const {MemoryStrategy} = require('@shopify/shopify-express/strategies');

const {
  NODE_ENV,
  SHOPIFY_APP_SECRET,
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
} = process.env;

const paths ={
  AUTH,
  API,
  CALLBACK,
  CLIENT_ENTRY,
  INSTALL,
  ORDER_CREATE_WEBHOOK,
} = require('../config/paths');

// Iniitalize storage strategy
const shopStore = new MemoryStrategy();

// Configure auth endpoints
module.exports.auth = createAuth({
  shopStore,
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  callbackRoute: CALLBACK,
  scope: ['write_orders, write_products'],
  afterAuth(request, response) {
    const { session: { accessToken, shop } } = request;

    registerWebhook(shop, accessToken, {
      topic: 'orders/create',
      address: `${SHOPIFY_APP_HOST}${ORDER_CREATE_WEBHOOK}`,
      format: 'json'
    });

    return response.redirect(CLIENT_ENTRY);
  },
});

// Setup verification middleware
module.exports.verifyAuth = createVerifyAuth({
  onFail(request, response) {
    const {session, query} = request;
    const shop = query.shop || session.shop;

    if (shop) {
      response.redirect(`${AUTH}?shop=${shop}`);
      return;
    }

    response.redirect(`${AUTH}?shop=${request.host}`);
  }
});

module.exports.verifyWebhook = createVerifyWebhook({
  shopStore,
  secret: SHOPIFY_APP_SECRET,
});

function registerWebhook(shopDomain, accessToken, webhook) {
  const shopName = shopDomain.replace('.myshopify.com', '');
  const client = new APIClient({ shopName: shopName, accessToken: accessToken });
  client.webhook.create(webhook).then(
    response => console.log(`webhook '${webhook.topic}' created`),
    err => console.log(`Error creating webhook '${webhook.topic}'. ${JSON.stringify(err.response.body)}`)
  );
}

module.exports.registerWebhook = registerWebhook;
module.exports.apiProxy = apiProxy;
