const router = require('express').Router();
const productApi = require('./product.api');

router.use('/products', productApi);

module.exports = router;