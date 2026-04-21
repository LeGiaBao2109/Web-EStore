const Order = require('../../models/order.model');
const OrderItem = require('../../models/orderItem.model');
const ExcelJS = require('exceljs');

class OrderService {
    async getOrdersForManager(status, search) {
        let filter = {};
        if (status && status !== 'all') filter.status = status;

        if (search && search.trim() !== "") {
            const keyword = search.trim();
            filter.$or = [{
                    phone: {
                        $regex: keyword,
                        $options: 'i'
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: {
                                $toString: "$_id"
                            },
                            regex: keyword,
                            options: "i"
                        }
                    }
                }
            ];
        }

        return await Order.find(filter)
            .populate('userId', 'name email')
            .sort({
                createdAt: -1
            });
    }

    async getOrderDetail(orderId) {
        const order = await Order.findById(orderId).populate('userId', 'name email');
        if (!order) throw new Error("Không tìm thấy đơn hàng");

        const items = await OrderItem.find({
                orderId: orderId
            })
            .populate('productId', 'name image');

        const totalAmount = order.totalAmount;
        const amountNotVAT = Math.round(totalAmount / 1.1);
        const vatAmount = totalAmount - amountNotVAT;

        return {
            order,
            items,
            invoiceCalc: {
                amountNotVAT,
                vatRate: "10%",
                vatAmount,
                totalAmount
            }
        };
    }

    async updateOrderInfo(orderId, data) {
        const {
            status,
            paymentStatus
        } = data;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, {
                status,
                paymentStatus,
                updatedAt: Date.now()
            }, {
                new: true
            }
        );
        if (!updatedOrder) throw new Error("Cập nhật đơn hàng thất bại");
        return updatedOrder;
    }

    async exportOrdersToExcel() {
        const orders = await Order.find().populate('userId', 'name');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách đơn hàng');

        worksheet.columns = [{
                header: 'Mã đơn',
                key: 'id',
                width: 30
            },
            {
                header: 'Ngày đặt',
                key: 'date',
                width: 20
            },
            {
                header: 'Khách hàng',
                key: 'customer',
                width: 25
            },
            {
                header: 'SĐT',
                key: 'phone',
                width: 15
            },
            {
                header: 'Tổng tiền (Gồm VAT)',
                key: 'total',
                width: 20
            },
            {
                header: 'Tiền hàng (Chưa VAT)',
                key: 'subtotal',
                width: 20
            },
            {
                header: 'Tiền thuế VAT',
                key: 'vat',
                width: 15
            },
            {
                header: 'Trạng thái',
                key: 'status',
                width: 15
            }
        ];

        worksheet.getRow(1).font = {
            bold: true
        };

        orders.forEach(order => {
            const total = order.totalAmount;
            const subtotal = Math.round(total / 1.1);
            const vat = total - subtotal;

            worksheet.addRow({
                id: order._id.toString(),
                date: new Date(order.createdAt).toLocaleString('vi-VN'),
                customer: order.userId ?.name || 'N/A',
                phone: order.phone,
                total: total,
                subtotal: subtotal,
                vat: vat,
                status: order.status
            });
        });

        worksheet.getColumn('total').numFmt = '#,##0"đ"';
        worksheet.getColumn('subtotal').numFmt = '#,##0"đ"';
        worksheet.getColumn('vat').numFmt = '#,##0"đ"';

        return workbook;
    }
}

module.exports = new OrderService();