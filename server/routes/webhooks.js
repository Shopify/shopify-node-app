const express = require('express');
const { withWebhook } = require('../middleware/webhooks');
const router = express.Router();

router.all('/order-create', withWebhook, (request, response) => {
  console.log('We got a webhook!');
  console.log('Details: ', request.webhook);
  console.log('Body:', request.body);
});

module.exports = router;
