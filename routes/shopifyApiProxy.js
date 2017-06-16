const httpProxy = require('http-proxy');
const url = require('url');
const express = require('express');

const proxy = new httpProxy.createProxyServer();
const router = express.Router();

router.all('/:endpoint', function(req, res, next) {
  // we don't get the token here because we're dumb
      // ie. this isn't the client as got the token because of xhrs
  //solutions:
    // you can store sessions somehow persistently and then give users access tokens...
    // its gonna be gross! :)

  const shop = req.session.shop;
  const endpoint = req.params.endpoint;
  proxy.proxyRequest(req, res, {
    target: `https://${shop}/admin/${endpoint}`,
    ignorePath: true,
    headers: {
      'X-Shopify-Access-Token': req.session.access_token,
    },
  });
});

module.exports = router;
