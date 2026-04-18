const router = require("express").Router();

const adminRoutes = require("./admin.route");

router.use('/', adminRoutes);

module.exports = router;