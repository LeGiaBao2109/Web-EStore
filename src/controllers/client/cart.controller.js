const path = require('path');

module.exports.index = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/cart.html"));
}

module.exports.payment = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/payment.html"));
}