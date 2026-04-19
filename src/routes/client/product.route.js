const router = require('express').Router();
const productController = require('../../controllers/client/product.controller');

router.get('/', productController.list);
router.get('/:slug', productController.detail);

module.exports = router;