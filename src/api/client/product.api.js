const router = require('express').Router();
const serviceProduct = require('../../services/client/product.service');
const serviceCart = require('../../services/client/cart.service');

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
            return res.json({
                success: true,
                data: []
            });
        }

        const products = await serviceProduct.findProductList({
            searchKeyword: keyword,
            status: "active"
        });

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

router.get('/detail/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await serviceProduct.findProductBySlug(slug);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;