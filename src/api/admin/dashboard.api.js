const router = require('express').Router();
const dashboardService = require('../../services/admin/dashboard.service');

router.get('/stats', async (req, res) => {
    try {
        const {
            from,
            to
        } = req.query;
        const data = await dashboardService.getStats(from, to);
        res.json({
            success: true,
            ...data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;