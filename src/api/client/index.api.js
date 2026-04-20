const router = require('express').Router();
const productApi = require('./product.api');
const authApi = require('./auth.api');
const cartApi = require('./cart.api');

router.use('/products', productApi);
router.use('/auth', authApi);
router.use('/cart', cartApi);

module.exports = router;