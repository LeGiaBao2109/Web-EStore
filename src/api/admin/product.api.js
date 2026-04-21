const router = require('express').Router();
const productService = require('../../services/admin/product.service');

router.get('/', async (req, res) => {
    try {
        const products = await productService.getProductsForManager();
        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/create', async (req, res) => {
    try {
        const adminId = req.session.admin.id;
        const product = await productService.createProduct(req.body, adminId);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const product = await productService.updateProductInfo(req.params.id, req.body);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/update-price/:id', async (req, res) => {
    try {
        const adminId = req.session.admin.id;
        const newPrice = await productService.updatePrice(req.params.id, req.body, adminId);
        res.json({
            success: true,
            newPrice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/update-stock/:id', async (req, res) => {
    try {
        const adminId = req.session.admin.id;
        const product = await productService.updateStock(req.params.id, req.body, adminId);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/price-history/:id', async (req, res) => {
    try {
        const history = await productService.getPriceHistory(req.params.id);
        res.json({
            success: true,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
});

router.get('/warehouse-logs/:id', async (req, res) => {
    try {
        const logs = await productService.getWarehouseLogs(req.params.id);
        res.json({
            success: true,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
});

module.exports = router;