const { URL } = require('url');
const store = require('../persistentStore');
const fetch = require('node-fetch');

const ALLOWED_URLS = ['/products', '/orders'];

module.exports = function shopifyApiProxy(request, response, next) {
  const { query, method, path, body } = request;

  const { userId } = query;

  return store.getToken(userId, (err, userData) => {
    if (err) {
      return response.status(500);
    }

    if (userData == null) {
      return response.status(401);
    }

    const { shop, accessToken } = userData;

    const strippedPath = path.split('?')[0].split('.json')[0];

    const inAllowed = ALLOWED_URLS.some(resource => {
      return strippedPath === resource;
    });

    if (!inAllowed) {
      return response.status(403);
    }

    const fetchOptions = {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    };

    fetchWithParams(
      `https://${shop}/admin${path}`,
      fetchOptions,
      query
    ).then(remoteResponse => {
      remoteResponse
        .json()
        .then(responseBody => {
          response.status(remoteResponse.status).send(responseBody);
        })
        .catch(err => response.err(err));
    });
  });
};

function fetchWithParams(url, fetchOpts, query) {
  const parsedUrl = new URL(url);

  parsedUrl.searchParams.delete('userId');

  Object.entries(query).forEach(([key, value]) => {
    parsedUrl.searchParams.append(key, value);
  });

  return fetch(parsedUrl.href, fetchOpts);
}
