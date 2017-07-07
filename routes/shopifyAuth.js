const express = require("express");
const querystring = require("querystring");
const fetch = require("node-fetch");
const crypto = require("crypto");

module.exports = function shopifyAuth({
  host,
  apiKey,
  secret,
  scope,
  afterAuth
}) {
  const router = express.Router();

  // This function initializes the Shopify OAuth Process
  // The template in views/embedded_app_redirect.ejs is rendered
  router.get("/", function(request, response) {
    if (request.query.shop) {
      request.session.shop = request.query.shop;
      const redirectTo = `https://${request.query.shop}/admin/oauth/authorize`;
      const redirectParams = `?client_id=${apiKey}&scope=${scope}&redirect_uri=${host}/auth/shopify/callback`;
      response.send(
        `<!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              window.top.location.href = "${redirectTo}${redirectParams}"
            </script>
          </head>
        </html>`
      );
    }
  });

  // After the users clicks 'Install' on the Shopify website, they are redirected here
  // Shopify provides the app the is authorization_code, which is exchanged for an access token
  router.get("/callback", verifyRequest, (request, response) => {
    if (request.query.shop) {
      const params = {
        client_id: apiKey,
        client_secret: secret,
        code: request.query.code
      };
      const requestBody = querystring.stringify(params);
      fetch(`https://${request.query.shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(requestBody)
        },
        body: requestBody
      })
        .then(remoteResponse => remoteResponse.json())
        .then(responseBody => {
          request.session.accessToken = responseBody.access_token;
          afterAuth(request, response);
        });
    }
  });

  function verifyRequest(request, response, next) {
    const map = JSON.parse(JSON.stringify(request.query));
    delete map["signature"];
    delete map["hmac"];

    const message = querystring.stringify(map);
    const generated_hash = crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("hex");

    if (generated_hash === request.query.hmac) {
      next();
    } else {
      return response.json(400);
    }
  }

  return router;
};
