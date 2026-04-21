const mongoose = require("mongoose");

const warehouseLogSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sku: String,
    type: {
        type: String,
        enum: ["import", "export"]
    },
    quantity: Number,
    note: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("WarehouseLog", warehouseLogSchema, "warehouse_logs");