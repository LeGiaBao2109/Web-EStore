const router = require('express').Router();

const adminLoginController = require('../../controllers/admin/login.controller');

router.get('/', adminLoginController.login);

module.exports = router;