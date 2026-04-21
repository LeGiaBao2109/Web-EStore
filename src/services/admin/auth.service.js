const bcrypt = require("bcrypt");
const Admin = require("../../models/admin.model");

module.exports.login = async (adminCode, password) => {
    try {
        const admin = await Admin.findOne({
            adminCode: adminCode,
            status: "active"
        });

        if (!admin) {
            return {
                success: false,
                message: "Mã định danh hoặc mật khẩu không chính xác!"
            };
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return {
                success: false,
                message: "Mã định danh hoặc mật khẩu không chính xác!"
            };
        }

        const adminData = admin.toObject();
        delete adminData.password;

        return {
            success: true,
            admin: adminData
        };

    } catch (error) {
        console.error("LỖI TẠI AUTH SERVICE:", error);
        return {
            success: false,
            message: "Hệ thống đang gặp sự cố, vui lòng thử lại sau!"
        };
    }
};