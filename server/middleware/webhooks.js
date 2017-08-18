const crypto = require('crypto');
const shopStore = require('../shopStore');

const { SHOPIFY_APP_SECRET } = process.env;

function withWebhook(request, response, next) {
  console.log('I am webhook');
  const { body: data } = request;
  const hmac = request.get('X-Shopify-Hmac-Sha256');
  const topic = request.get('X-Shopify-Topic');
  const shopDomain = request.get('X-Shopify-Shop-Domain');

  const generated_hash = crypto
    .createHmac('sha256', SHOPIFY_APP_SECRET)
    // probably change the parser we're using
    .update(JSON.stringify(data))
    .digest('base64');

  if (generated_hash !== hmac) {
    return response.status(401).send("Request doesn't pass HMAC validation");
  }

  shopStore.getShop({ shop: shopDomain }, (error, { accessToken }) => {
    if (error) {
      next(error);
    }

    request.webhook = { topic, shopDomain, accessToken };

    next();
  });
}

module.exports = { withWebhook };
