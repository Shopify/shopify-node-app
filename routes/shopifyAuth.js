const express = require('express');
const querystring= require('querystring');
const request = require('request');
const crypto = require('crypto');

module.exports = function shopifyAuth({host, apiKey, secret, scope, afterAuth}) {
  const router = express.Router();

  // This function initializes the Shopify OAuth Process
  // The template in views/embedded_app_redirect.ejs is rendered
  router.get('/', function(req, res) {
    if (req.query.shop) {
      req.session.shop = req.query.shop;
      const redirect_to = `https://${req.query.shop}/admin/oauth/authorize`
      const redirect_params = `?client_id=${apiKey}&scope=${scope}&redirect_uri=${host}/auth/shopify/callback`
      res.send(
        `<!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              window.top.location.href = "${redirect_to}${redirect_params}"
            </script>
          </head>
        </html>`
      );
    }
  })

  // After the users clicks 'Install' on the Shopify website, they are redirected here
  // Shopify provides the app the is authorization_code, which is exchanged for an access token
  router.get('/callback', verifyRequest, function(req, res) {
    if (req.query.shop) {
      var params = {
        client_id: apiKey,
        client_secret: secret,
        code: req.query.code
      }
      var req_body = querystring.stringify(params);
      request({
        url: `https://${req.query.shop}/admin/oauth/access_token`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(req_body)
        },
        body: req_body
      },
      function(err,resp,body) {
        body = JSON.parse(body);
        req.session.access_token = body.access_token;
        afterAuth(req, res)
      })
    }
  })

  function verifyRequest(req, res, next) {
    var map = JSON.parse(JSON.stringify(req.query));
    delete map['signature'];
    delete map['hmac'];

    var message = querystring.stringify(map);
    var generated_hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
    if (generated_hash === req.query.hmac) {
      next();
    } else {
      return res.json(400);
    }
  }

  return router;
};
