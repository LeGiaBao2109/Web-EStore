const router = require('express').Router();
const productApi = require('./product.api');
const authApi = require('./auth.api');

router.use('/products', productApi);
router.use('/auth', authApi);

module.exports = router;