const {URL} = require('url');
const proxy = require('express-http-proxy');
const store = require('../persistentStore');
const fetch = require('node-fetch');

const ALLOWED_LIST = ['/products', '/orders'];

module.exports = function shopifyApiProxy(request, response, next) {
  const {
    query,
    method,
    path,
    body,
   } = request;

  const {userId} = query;

  return store.getToken(userId, (err, userData) => {
    if (err || !userData) {
      return response.status(401);
    }

    const { shop, accessToken } = userData;

    const strippedPath = path.split('?')[0].split('.json')[0];

    const inAllowed = ALLOWED_LIST.some((resource) => {
      return strippedPath === resource;
    });

    if (!inAllowed) {
      return response.status(403);
    }

    fetchWithParams(`https://${shop}/admin/${path}`, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
    })
    .then(remoteResponse => {
      remoteResponse
        .json()
        .then(responseBody => {
          response
            .status(remoteResponse.status)
            .send(responseBody);
        })
    })

  });
};

function fetchWithParams(url, fetchOpts, params = {}) {
  const parsedUrl = new URL(url)

  parsedUrl.searchParams.delete('userId');

  Object
    .keys(params)
    .forEach(key => {
      parsedUrl.searchParams.append(key, params[key])
    });

  return fetch(parsedUrl.href, fetchOpts);
};
