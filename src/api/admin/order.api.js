const router = require('express').Router();
const orderService = require('../../services/admin/order.service');

router.get('/', async (req, res) => {
    try {
        const {
            status,
            search
        } = req.query;
        const orders = await orderService.getOrdersForManager(status, search);
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/export/excel', async (req, res) => {
    try {
        const workbook = await orderService.exportOrdersToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Orders.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await orderService.getOrderDetail(req.params.id);
        res.json({
            success: true,
            ...result
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
        const updatedOrder = await orderService.updateOrderInfo(req.params.id, req.body);
        res.json({
            success: true,
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;