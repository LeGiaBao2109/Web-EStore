const router = require('express').Router();
const searchController = require('../../controllers/client/search.controller');

// Search results page
router.get('/', searchController.search);

module.exports = router;
