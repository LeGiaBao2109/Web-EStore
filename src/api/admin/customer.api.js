const router = require('express').Router();
const customerService = require('../../services/admin/customer.service');

router.get('/', async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers(req.query.search);
        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await customerService.getCustomerDetail(req.params.id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const user = await customerService.updateCustomer(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/toggle-status/:id', async (req, res) => {
    try {
        const user = await customerService.toggleStatus(req.params.id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;