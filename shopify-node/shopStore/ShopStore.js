const RedisStrategy = require('./RedisStrategy');
const MemoryStrategy = require('./MemoryStrategy');

const ENGINES = {
  REDIS: 'redis',
  MEMORY: 'memory',
};

module.exports = class ShopStore {
  constructor(type = ENGINES.MEMORY) {
    switch (type) {
      case ENGINES.REDIS:
        return new RedisStrategy();
      case ENGINES.MEMORY:
      default:
        if (process.env.NODE_ENV === 'production') {
          console.error('Memory store is not suitable for production!');
        }
        return new MemoryStrategy();
    }
  }
};
