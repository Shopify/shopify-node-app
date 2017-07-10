const Redis = require('redis');
const uuid = require('uuid/v1');

const redis = Redis.createClient();

module.exports.storeUser = ({ accessToken, shop }, done) => {
  const id = uuid();

  redis.hmset(id, { accessToken, shop }, err => {
    if (err) {
      return done(err);
    }

    done(null, id);
  });
};

module.exports.getToken = (id, done) => {
  redis.hgetall(id, (err, remoteToken) => {
    if (err) {
      return done(err);
    }

    done(null, remoteToken);
  });
};
