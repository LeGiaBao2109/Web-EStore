const router = require('express').Router();
const authService = require('../../services/client/auth.service');
const ForgotPassword = require("../../models/forgot-password.model");
const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const { sendMail } = require("../../public/assets/js/helpers/sendMail");
const generateHelper = require("../../public/assets/js/helpers/generate.helper");

router.post('/register', async (req, res) => {
    const result = await authService.register(req.body);
    res.json(result);
});

router.post('/login', async (req, res) => {
    const result = await authService.login(req.body.account, req.body.password);
    if (result.success) {
        req.session.user = { 
            id: result.user._id, 
            email: result.user.email,
            name: result.user.name 
        };
    }
    res.json(result);
});

router.post('/password/forgot', async (req, res) => {
    const email = req.body.email;
    const user = await authService.checkEmailExist(email);
    
    if (!user) {
        return res.json({ success: false, message: "Email không tồn tại trong hệ thống!" });
    }

    const otp = generateHelper.generateRandomNumber(6);

    const objectForgotPassword = { email: email, otp: otp };
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = "Mã OTP xác nhận đổi mật khẩu";
    const html = `Mã OTP của bạn là <b style="color: red; font-size: 20px;">${otp}</b>. Mã có hiệu lực trong 3 phút.`;
    
    try {
        await sendMail(email, subject, html);
        res.json({ success: true, message: "Đã gửi mã OTP qua Email của bạn!" });
    } catch (error) {
        res.json({ success: false, message: "Lỗi gửi mail, vui lòng thử lại!" });
    }
});

router.post('/password/otp', async (req, res) => {
    const { email, otp } = req.body;

    const result = await ForgotPassword.findOne({ email: email, otp: otp });

    if (!result) {
        return res.json({ success: false, message: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
    }

    res.json({ success: true, message: "Xác thực thành công, mời bạn đổi mật khẩu." });
});

router.post('/password/reset', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await User.updateOne({ email: email }, { password: hashedPassword });
        await ForgotPassword.deleteMany({ email: email });
        
        res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.json({ success: false, message: "Đổi mật khẩu thất bại, thử lại sau!" });
    }
});

router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;