const router = require('express').Router();
const userService = require('../../services/client/user.service');
const { requireAuth } = require('../../middlewares/client/user.middleware');

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await userService.getUserById(req.session.user.id);
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Không thể tải thông tin!"
        });
    }
});

router.post('/update-profile', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const result = await userService.updateProfile(userId, req.body);
        if (result.success) {
            req.session.user.name = req.body.name;
            req.session.user.email = req.body.email;
        }
        res.json(result);
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi cập nhật hệ thống!"
        });
    }
});

router.get('/orders', requireAuth, async (req, res) => {
    try {
        const orders = await userService.getOrdersByUserId(req.session.user.id);
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi tải đơn hàng!"
        });
    }
});

router.get('/order-history/:id', requireAuth, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await userService.getOrderById(orderId);

        if (!order) {
            return res.json({
                success: false,
                message: "Không tìm thấy đơn hàng!"
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi tải chi tiết đơn hàng!"
        });
    }
});

router.post('/change-password', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const {
            oldPassword,
            newPassword
        } = req.body;
        const result = await userService.changePassword(userId, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi đổi mật khẩu!"
        });
    }
});

router.post('/reviews/add', requireAuth, async (req, res) => {
    try {
        const { productName, content } = req.body;
        const userId = req.session.user.id;

        const result = await userService.addReview(userId, productName, content);
        res.json(result);
    } catch (error) {
        res.json({
            success: false,
            message: "Lỗi hệ thống!"
        });
    }
});

module.exports = router;