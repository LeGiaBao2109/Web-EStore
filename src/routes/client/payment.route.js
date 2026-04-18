const router = require("express").Router();

const paymentController = require("../../controllers/client/payment.controller");

router.get("/", paymentController.index);

module.exports = router;
