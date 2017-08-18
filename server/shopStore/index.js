const Store = require('./ShopStore');

module.exports = new Store(process.env.SHOPIFY_APP_STORAGE_ENGINE);
