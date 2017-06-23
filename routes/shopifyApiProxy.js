const express = require('express');
const request = require('request');

const store = require('../persistentStore');
const router = express.Router();

const ALLOWED_LIST = [
  'products',
  'orders',
]

function legalPath(path) {
  const strippedPath = path
    .split('?')[0]
    .split('.json')[0];

  return ALLOWED_LIST.some((resource) => {
    return strippedPath === resource;
  })
}

router.all('/:endpoint', (req, res, next) => {
  const {
    method,
    body,
    params: {endpoint},
    query: {userId},
  } = req;

  if (!legalPath(endpoint)) {
    return res.status(403).send({error: `${endpoint} is forbidden by shopifyApiProxy`});
  }

  store.getToken(userId, (err, userData) => {
    if (err || !userData) {
      return res.status(401).send(err);
    }

    const {shop, apiToken} = userData;
    const uri = `https://${shop}/admin/${endpoint}`;

    request({
        method,
        uri,
        headers: {
          'X-Shopify-Access-Token': apiToken,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    }, (remoteError, remoteResponse, body) => {
      if (remoteError) {
        return res.status(500).send(remoteError);
      }
      res.status(remoteResponse.statusCode).send(body);
    });
  });
});

module.exports = router;
