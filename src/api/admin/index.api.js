const router = require('express').Router();
const authMiddleware = require('../../middlewares/admin/auth.middleware');
const authApi = require('./auth.api');
const productApi = require('./product.api');
const orderApi = require('./order.api');
const customerApi = require('./customer.api');
const dashboardApi = require('./dashboard.api');

router.use('/auth', authApi); 

router.use(authMiddleware.requireAuth);

router.use('/products', productApi);

router.use('/orders', orderApi);

router.use('/customers', customerApi);

router.use('/dashboard', dashboardApi);

module.exports = router;