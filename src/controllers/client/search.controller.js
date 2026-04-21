const path = require('path');

module.exports.search = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/client/search.html'));
};
