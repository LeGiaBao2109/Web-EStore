const path = require('path');

module.exports.index = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/cart.html"));
}