const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: String,
    password: String,
    phone: String,
    address: String,
    status: {
        type: String,
        enum: ["active", "block"],
        default: "active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema, "users");