const Knex = require('knex');

module.exports = class SqliteStrategy {
  constructor() {
    this.knex = Knex({
      dialect: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './db.sqlite3'
      }
    });

    this.knex.schema.createTableIfNotExists('shops', (table) => {
      table.increments('id');
      table.string('shopify_domain');
      table.string('access_token');
      table.unique('shopify_domain');
    }).catch((err) => {
      console.log(err)
    })
  }

  storeShop({ shop, accessToken, data = {} }, done) {
    this.knex.insert({shopify_domain: shop, access_token: accessToken}).into('shops')
      .whereNotExists('shopify_domain', shop)
      .then((result) => {
        return done(null, accessToken);
      })
  }

  getShop({ shop }, done) {
    this.knex('shops').where('shopify_domain', shop)
      .then((result) => {
        return done(null, shopData);
      })
  }
}
