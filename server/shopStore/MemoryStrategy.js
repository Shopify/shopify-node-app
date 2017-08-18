const uuid = require('uuid/v1');

module.exports = class MemoryStore {
  constructor() {
    this.store = {};
  }

  storeShop({ shop, accessToken }, done) {
    this.store[shop] = {
      accessToken,
      clientToken: uuid(),
    };

    return done(null, this.store[shop]);
  }

  getShop({ shop }, done) {
    return done(null, this.store[shop]);
  }

  verifyClientToken({ shop, token }, done) {
    const {clientToken} = this.store[shop];
    return done(null, this.store[shop]);
  }
}
