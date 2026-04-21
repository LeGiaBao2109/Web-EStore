const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        url: String,
        publicId: String
    },
    brand: String,
    category: String,
    description: String,
    priceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Price"
    },
    stock: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema, "products");