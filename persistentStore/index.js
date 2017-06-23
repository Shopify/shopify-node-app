const Redis = require('redis');
const uuid = require('uuid/v1');

const redis = Redis.createClient();

module.exports.storeUser = ({apiToken, shop}, done) => {
  const id = uuid();

  redis.hmset(id, {apiToken, shop}, (err) => {
    if (err) { return done(err) }

    done(null, id);
  });
}

module.exports.getToken = (id, done) => {
  redis.hgetall(id, (err, remoteToken) => {
    if (err) { return done(err) }

    done(null, remoteToken);
  });
}
