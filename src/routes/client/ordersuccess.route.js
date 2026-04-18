const router = require("express").Router();

const ordersuccessController = require("../../controllers/client/ordersuccess.controller");

router.get("/", ordersuccessController.index);

module.exports = router;
