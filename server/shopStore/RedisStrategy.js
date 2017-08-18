const Redis = require('redis');
const uuid = require('uuid/v1');

module.exports = class RedisStore {
  constructor() {
    this.client = Redis.createClient();
  }

  storeShop({ shop, accessToken }, done) {
    redis.hmset(shop, { accessToken, clientToken }, err => {
      if (err) {
        done(err);
      }

      done(null, clientToken);
    });
  }

  getShop({ shop }, done) {
    redis.hgetall(shop, (err, { clientToken, accessToken }) => {
      if (err) {
        return done(err);
      }

      done(null, { clientToken, accessToken });
    });
  }

  verifyClientToken({ shop, token }, done) {
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
}
