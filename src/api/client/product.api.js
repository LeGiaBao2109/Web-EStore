const router = require('express').Router();
const serviceProduct = require('../../services/client/product.service');

router.get('/get-products', async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            brand: req.query.brand,
            sortPrice: req.query.sortPrice,
            priceRanges: req.query['priceRanges[]'] || req.query.priceRanges,
            searchKeyword: req.query.keyword || req.query.searchKeyword
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

    router.get('/search', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.json({ success: true, data: [] });
        }

        // Pass keyword string, service will create RegExp
        const products = await serviceProduct.findProductList({
            searchKeyword: keyword,
            status: "active"
        });

        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});module.exports = router;