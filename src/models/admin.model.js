const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminCode: {
        type: String,
        unique: true
    },
    username: String,
    password: String,
    name: String,
    permissions: [String],
    status: {
        type: String,
        enum: ["active", "block"],
        default: "active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Admin", adminSchema);