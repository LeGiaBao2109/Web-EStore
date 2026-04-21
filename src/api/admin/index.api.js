const router = require('express').Router();
const authMiddleware = require('../../middlewares/admin/auth.middleware');
const authApi = require('./auth.api');
const productApi = require('./product.api');
const orderApi = require('./order.api');

router.use('/auth', authApi); 

router.use(authMiddleware.requireAuth);

router.use('/products', productApi);

router.use('/orders', orderApi);

module.exports = router;