const { URL } = require('url');

const ALLOWED_URLS = ['/products', '/orders'];

module.exports = function shopifyApiProxy(request, response, next) {
  const { query, method, path, body, session } = request;
  const { shop, accessToken } = session;

  const strippedPath = path.split('?')[0].split('.json')[0];

  const inAllowed = ALLOWED_URLS.some(resource => {
    return strippedPath === resource;
  });

  if (!inAllowed) {
    return response.status(403).send('Endpoint not in whitelist');
  }

  const fetchOptions = {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
  };

  fetchWithParams(`https://${shop}/admin${path}`, fetchOptions, query)
    .then(remoteResponse => {
      const { status } = remoteResponse;
      return Promise.all([remoteResponse.json(), status]);
    })
    .then(([responseBody, status]) => {
      response.status(status).send(responseBody);
    })
    .catch(err => response.err(err));
};

function fetchWithParams(url, fetchOpts, query) {
  const parsedUrl = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    parsedUrl.searchParams.append(key, value);
  });

  return fetch(parsedUrl.href, fetchOpts);
}
