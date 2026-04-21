const router = require('express').Router();
const authMiddleware = require('../../middlewares/admin/auth.middleware');
const authApi = require('./auth.api');
const productApi = require('./product.api');

// 1. Phải để route login LÊN TRÊN (Không được chặn cái này)
router.use('/auth', authApi); 

// 2. Những gì nằm DƯỚI dòng này mới bị chặn
router.use(authMiddleware.requireAuth);

// 3. Các chức năng khác của team (sản phẩm, đơn hàng...) để ở dưới này
router.use('/products', productApi);

module.exports = router;