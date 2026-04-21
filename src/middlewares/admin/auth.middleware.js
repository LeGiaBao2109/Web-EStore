module.exports.requireAuth = (req, res, next) => {
    if (!req.session.admin) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập!"
        });
    }
    next();
};