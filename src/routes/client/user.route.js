const router = require('express').Router();

const userController = require('../../controllers/client/user.controller');

router.get('/', userController.index);
router.get('/order-history', userController.orderHistory);

module.exports = router;