const router = require('express').Router();
const orderService = require('../../services/client/order.service');
const { requireAuth } = require('../../middlewares/client/user.middleware');

router.post('/checkout', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const orderData = req.body;

        const result = await orderService.processCheckout(userId, orderData);

        if (result.success) {
            res.json({
                success: true,
                message: "Đặt hàng thành công!",
                orderId: result.orderId
            });
        } else {
            res.json({
                success: false,
                message: result.message 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Có lỗi hệ thống xảy ra!"
        });
    }
});

module.exports = router;