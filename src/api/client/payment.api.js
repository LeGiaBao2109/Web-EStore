const router = require('express').Router();
const paymentService = require('../../services/client/payment.service');

router.get('/get-checkout-data', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để tiếp tục"
            });
        }

        const userId = req.session.user.id;
        const { type, productId } = req.query;

        const result = await paymentService.getCheckoutData(userId, type, productId);

        if (!result.success) {
            return res.json(result);
        }

        res.json({
            success: true,
            data: {
                items: result.items,
                totalAmount: result.totalAmount
            },
            user: req.session.user
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi Server: " + error.message
        });
    }
});

module.exports = router;