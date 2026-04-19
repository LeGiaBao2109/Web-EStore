const router = require('express').Router();
const serviceProduct = require('../../services/client/product.service');

router.get('/get-products', async (req, res) => {
    try {
        // Extract filter parameters from query string
        const filters = {
            brand: req.query.brand,
            sortPrice: req.query.sortPrice,
            priceRanges: req.query['priceRanges[]'] || req.query.priceRanges
        };

        const products = await serviceProduct.findProductList(filters);

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