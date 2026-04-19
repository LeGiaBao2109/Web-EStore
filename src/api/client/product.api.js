const router = require('express').Router();
const serviceProduct = require('../../services/client/product.service');

router.get('/get-products', async (req, res) => {
    try {
        const products = await serviceProduct.findProductList();
        res.json({ 
            success: true, 
            data: products 
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            error: error.message
        });
    }
});

module.exports = router;