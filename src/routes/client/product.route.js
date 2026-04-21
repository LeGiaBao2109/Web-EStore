const router = require('express').Router();
const productController = require('../../controllers/client/product.controller');

router.get('/detail/:slug', productController.detail);

router.get('/:category/brand/:slugBrand', productController.list); 

router.get('/search', productController.list);

router.get('/:category', productController.list);

module.exports = router;