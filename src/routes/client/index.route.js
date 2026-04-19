const router = require("express").Router();

const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");
const searchRoutes = require("./search.route");

router.use('/', homeRoutes);
router.use('/cart', cartRoutes);
router.use('/user-profile', userRoutes);
router.use('/search', searchRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);

module.exports = router;
