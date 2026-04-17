const path = require('path');

module.exports.list = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/product-list.html"));
}

module.exports.detail = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/product-detail.html"));
}