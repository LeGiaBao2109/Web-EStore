const path = require('path');

// Render search results page
module.exports.search = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/client/search.html'));
};
