const router = require("express").Router();

const adminRoutes = require("./admin.route");
const adminLoginRoutes = require("./login.route");

router.use('/login', adminLoginRoutes);
router.use('/', adminRoutes);

module.exports = router;