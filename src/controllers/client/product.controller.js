const path = require('path');

module.exports.list = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/product-list.html"));
}
