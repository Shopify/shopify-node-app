const proxy = require("express-http-proxy");
const store = require("../persistentStore");

const ALLOWED_LIST = ["/products", "/orders"];

module.exports = function shopifyApiProxy(request, response, next) {
  const { query: { userId } } = request;

  return store.getToken(userId, (err, userData) => {
    if (err || !userData) {
      return response.status(401);
    }
    const { shop, accessToken } = userData;

    return proxy(`https://${shop}`, {
      https: true,
      filter: function({ path }, res) {
        const strippedPath = path.split("?")[0].split(".json")[0];

        return ALLOWED_LIST.some(resource => {
          return strippedPath === resource;
        });
      },
      proxyReqPathResolver({ url }) {
        return `/admin${url}`;
      },
      proxyReqOptDecorator(proxyRequestOptions, sourceRequest) {
        proxyRequestOptions.headers["X-Shopify-Access-Token"] = accessToken;
        proxyRequestOptions.headers["content-type"] = "application/json";
        return proxyRequestOptions;
      }
    })(request, response, next);
  });
};
