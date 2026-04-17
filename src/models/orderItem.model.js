const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sku: String,
    price: Number,
    quantity: Number,
    total: Number
});

module.exports = mongoose.model("OrderItem", orderItemSchema);