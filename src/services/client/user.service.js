const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const OrderItem = require("../../models/orderItem.model");
const Review = require("../../models/review.model");
const bcrypt = require("bcrypt");

module.exports.getUserById = async (id) => {
    return await User.findById(id).select("-password");
};

module.exports.updateProfile = async (id, data) => {
    try {
        await User.updateOne({
            _id: id
        }, data);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports.getOrdersByUserId = async (userId) => {
    try {
        const orders = await Order.find({
            userId
        }).sort({
            createdAt: -1
        }).lean();

        for (let order of orders) {
            order.items = await OrderItem.find({
                    orderId: order._id
                })
                .populate({
                    path: 'productId',
                    select: 'name thumbnail'
                })
                .lean();
        }

        return orders;
    } catch (error) {
        return [];
    }
};

module.exports.getOrderById = async (orderId) => {
    try {
        const order = await Order.findById(orderId)
            .populate({
                path: 'userId',
                select: 'name email phone'
            })
            .lean();
            
        if (order) {
            order.items = await OrderItem.find({
                    orderId: order._id
                })
                .populate({
                    path: 'productId',
                    select: 'name image thumbnail price'
                })
                .lean();
        }
        return order;
    } catch (error) {
        return null;
    }
};

module.exports.changePassword = async (id, oldPassword, newPassword) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return {
                success: false,
                message: "Người dùng không tồn tại!"
            };
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return {
                success: false,
                message: "Mật khẩu hiện tại không chính xác!"
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne({
            _id: id
        }, {
            password: hashPassword
        });
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports.addReview = async (userId, productName, content) => {
    try {
        const newReview = new Review({
            userId: userId,
            productName: productName,
            comment: content
        });
        await newReview.save();
        return {
            success: true,
            message: "Gửi đánh giá thành công!"
        };
    } catch (error) {
        return {
            success: false,
            message: "Lỗi lưu đánh giá: " + error.message
        };
    }
};