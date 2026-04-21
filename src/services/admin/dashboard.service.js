const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const moment = require('moment');

class DashboardService {
    async getStats(from, to) {
        const startDate = from ? new Date(from) : moment().startOf('month').toDate();
        const endDate = to ? moment(to).endOf('day').toDate() : moment().endOf('month').toDate();

        const orders = await Order.find({
            status: 'completed',
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const products = await Product.find({
            status: 'active'
        });
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

        const newOrders = await Order.countDocuments({
            status: 'pending',
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const chartStats = await Order.aggregate([{
                $match: {
                    status: 'completed',
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%d/%m",
                            date: "$createdAt"
                        }
                    },
                    dailyRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]);

        return {
            cards: {
                revenue: (totalRevenue / 1000000).toFixed(1),
                stock: totalStock,
                newOrders: newOrders
            },
            chart: {
                labels: chartStats.map(item => item._id),
                revenue: chartStats.map(item => item.dailyRevenue / 1000000)
            }
        };
    }
}

module.exports = new DashboardService();