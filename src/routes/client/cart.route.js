const router = require('express').Router();

const cartController = require('../../controllers/client/cart.controller');

router.get('/', cartController.index);
router.get('/payment', cartController.payment);

module.exports = router;