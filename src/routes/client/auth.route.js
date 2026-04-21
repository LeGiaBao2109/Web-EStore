const router = require('express').Router();

const authController = require('../../controllers/client/auth.controller');

router.get('/', authController.auth);

module.exports = router;