const router = require("express").Router();

const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");

<<<<<<< HEAD
router.use('/', homeRoutes);
router.use('/cart', cartRoutes);
router.use('/user-profile', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
=======
router.use("/", homeRoutes);
router.use("/cart", cartRoutes);
router.use("/user-profile", userRoutes);
>>>>>>> feature/ui-cart

module.exports = router;
