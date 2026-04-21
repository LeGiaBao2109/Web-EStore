const Order = require("../../models/order.model");
const OrderItem = require("../../models/orderItem.model");
const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const WarehouseLog = require("../../models/warehouseLog.model");

module.exports.processCheckout = async (userId, orderData) => {
    try {
        const { items, totalAmount, address, phone, note, paymentMethod, type } = orderData;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return { 
                    success: false, 
                    message: `Sản phẩm ${product ? product.name : 'này'} không đủ hàng trong kho!` 
                };
            }
        }

        const newOrder = new Order({
            userId,
            totalAmount,
            address,
            phone,
            note,
            paymentMethod,
            status: "pending",
            paymentStatus: "unpaid"
        });
        await newOrder.save();

        for (const item of items) {
            const newItem = new OrderItem({
                orderId: newOrder._id,
                productId: item.productId,
                sku: item.sku,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            });
            await newItem.save();

            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });

            const log = new WarehouseLog({
                productId: item.productId,
                sku: item.sku,
                type: "export",
                quantity: item.quantity,
                note: `Xuất kho cho đơn hàng: ${newOrder._id}`,
                createdBy: userId
            });
            await log.save();
        }

        if (type === 'cart') {
            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalAmount: 0 } });
        }

        return { success: true, orderId: newOrder._id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};