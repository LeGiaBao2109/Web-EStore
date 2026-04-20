const router = require('express').Router();
const mongoose = require('mongoose');
const serviceProduct = require('../../services/client/product.service');
const serviceCart = require('../../services/client/cart.service');

router.post('/add', async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để mua hàng!"
            });
        }

        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({
                success: false,
                message: "ID sản phẩm không hợp lệ"
            });
        }

        const product = await serviceProduct.findProductById(productId);

        if (!product) {
            return res.json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        const result = await serviceCart.addToCart(userId, product, parseInt(quantity) || 1);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;