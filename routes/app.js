const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('app', { title: 'Shopify Node App' });
});

module.exports = router;
