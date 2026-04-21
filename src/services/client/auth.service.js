const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.register = async (userData) => {
    const existEmail = await User.findOne({
        email: userData.email
    });
    if (existEmail) {
        return {
            success: false,
            message: "Email này đã được đăng ký rồi!"
        };
    }

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: hashedPassword,
        status: "active"
    });

    await newUser.save();
    return {
        success: true
    };
};

module.exports.login = async (account, password) => {
    const user = await User.findOne({
        $or: [{
                email: account
            },
            {
                username: account
            }
        ],
        status: "active"
    });

    if (!user) {
        return {
            success: false,
            message: "Tài khoản không tồn tại!"
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return {
            success: false,
            message: "Mật khẩu không chính xác!"
        };
    }

    return {
        success: true,
        user: user
    };
};

module.exports.checkEmailExist = async (email) => {
    const user = await User.findOne({
        email: email,
        status: "active"
    });
    return user;
};