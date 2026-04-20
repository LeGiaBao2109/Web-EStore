const router = require('express').Router();
const productApi = require('./product.api');
const authApi = require('./auth.api');
const cartApi = require('./cart.api');
const orderApi = require('./order.api');
const paymentApi = require('./payment.api');

router.use('/products', productApi);
router.use('/auth', authApi);
router.use('/cart', cartApi);
router.use('/order', orderApi);
router.use('/payment', paymentApi);

module.exports = router;