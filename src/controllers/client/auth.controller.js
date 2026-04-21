const path = require('path');

module.exports.auth = (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/views/client/auth.html"));
}