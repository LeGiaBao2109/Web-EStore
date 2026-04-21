const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "banking"]
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid"
    },
    address: String,
    phone: String,
    note: String
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema, "orders");