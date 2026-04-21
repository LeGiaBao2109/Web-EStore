const serviceProduct = require("../../services/client/product.service");
const modelProduct = require("../../models/product.model");
const path = require('path');

module.exports.list = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/product-list.html"));
}

module.exports.detail = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/product-detail.html"));
}