const express = require('express');
const router = express.Router();
const authService = require('../../services/admin/auth.service');

router.post('/login', async (req, res) => {
    const {
        adminCode,
        password
    } = req.body;
    const result = await authService.login(adminCode, password);

    if (result.success) {
        req.session.admin = {
            id: result.admin._id,
            adminCode: result.admin.adminCode,
            name: result.admin.name
        };
        res.json({
            success: true,
            message: "Đăng nhập thành công"
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.message
        });
    }
});

router.get('/me', (req, res) => {
    if (req.session.admin) {
        res.json({
            success: true,
            admin: req.session.admin
        });
    } else {
        res.status(401).json({
            success: false
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({
        success: true
    });
});

module.exports = router;