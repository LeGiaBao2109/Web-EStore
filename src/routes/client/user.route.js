const router = require('express').Router();

const userController = require('../../controllers/client/user.controller');

router.get('/', userController.index);

module.exports = router;