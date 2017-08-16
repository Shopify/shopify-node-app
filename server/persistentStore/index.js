const Redis = require('redis');
const uuid = require('uuid/v1');

const redis = Redis.createClient();

function storeUser({ shop, accessToken }, done) {
  const clientToken = uuid();

  redis.hmset(shop, { accessToken, clientToken }, err => {
    if (err) {
      return done(err);
    }

    done(null, clientToken);
  });
}

function getUser({ shop }, done) {
  redis.hgetall(shop, (err, { clientToken, accessToken }) => {
    if (err) {
      return done(err);
    }

    done(null, { clientToken, accessToken });
  });
}

function verifyClientToken({ shop, token }, done) {
  redis.hgetall(shop, (err, { accessToken, clientToken }) => {
    if (err) {
      return done(err);
    }

    if (clientToken !== token) {
      return done(null, false);
    }

    return done(null, true);
  });
}

module.exports = {
  getUser,
  storeUser,
  verifyClientToken,
};
