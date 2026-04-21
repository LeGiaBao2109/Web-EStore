const router = require('express').Router();

const adminController = require('../../controllers/admin/admin.controller');

router.get('/', adminController.index);

module.exports = router;