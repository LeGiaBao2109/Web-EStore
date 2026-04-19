const router = require("express").Router();

const adminRoutes = require("./admin.route");
const adminLoginRoutes = require("./login.route");

router.use('/', adminRoutes);
router.use('/login', adminLoginRoutes);

module.exports = router;