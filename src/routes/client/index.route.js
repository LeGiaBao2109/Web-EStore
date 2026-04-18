const router = require("express").Router();

const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const paymentRoutes = require("./payment.route");
const ordersuccessRoutes = require("./ordersuccess.route");

router.use("/", homeRoutes);
router.use("/cart", cartRoutes);
router.use("/user-profile", userRoutes);
router.use("/payment", paymentRoutes);
router.use("/ordersuccess", ordersuccessRoutes);

module.exports = router;
