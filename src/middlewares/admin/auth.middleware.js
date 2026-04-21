module.exports.requireAuth = (req, res, next) => {
    if (!req.session.admin) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Vui lòng đăng nhập!"
        });
    }
    next();
};