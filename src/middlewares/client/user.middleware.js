module.exports.infoUser = (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
};

module.exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.json({
            success: false,
            message: "Bạn cần đăng nhập để thực hiện tính năng này!",
            errorType: "AUTH_REQUIRED"
        });
    }
    next();
};