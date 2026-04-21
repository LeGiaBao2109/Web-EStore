export function initOrders() {
    const loadOrders = () => {
        const status = $('#filterOrderStatus').val();
        const search = $('#content-orders input[type="text"]').val();

        $.ajax({
            url: `/api/admin/orders?status=${status}&search=${search}`,
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    renderOrderTable(res.orders);
                    renderOrderCards(res.orders);
                }
            }
        });
    };

    const renderOrderTable = (orders) => {
        let html = orders.map(order => `
            <tr>
                <td><span class="fw-bold">ORD-${order._id.slice(-6).toUpperCase()}</span></td>
                <td>
                    <div class="fw-bold small">${order.userId?.name || 'N/A'}</div>
                    <small class="text-muted" style="font-size: 0.75rem;">${order.phone}</small>
                </td>
                <td class="fw-bold text-danger">${Number(order.totalAmount).toLocaleString()}đ</td>
                <td>${getStatusBadge(order.status)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border-0"
                        onclick="viewOrderDetail('${order._id}')" data-bs-toggle="modal"
                        data-bs-target="#modalOrderDetail">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        $('#content-orders table tbody').html(html || '<tr><td colspan="5" class="text-center">Không tìm thấy đơn hàng nào</td></tr>');
    };

    const renderOrderCards = (orders) => {
        let html = orders.map(order => `
            <div class="card border-0 shadow-sm rounded-4 p-3 mb-3 border-start border-4 ${getStatusBorder(order.status)}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="fw-bold text-dark">#ORD-${order._id.slice(-6).toUpperCase()}</span>
                        <div class="small text-muted">${new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                    ${getStatusBadge(order.status)}
                </div>
                <div class="mb-3">
                    <div class="fw-bold">${order.userId?.name || 'N/A'}</div>
                    <div class="text-muted small">${order.phone}</div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="fw-bold text-danger">${Number(order.totalAmount).toLocaleString()}đ</div>
                    <button class="btn btn-sm btn-danger rounded-3 px-3"
                        onclick="viewOrderDetail('${order._id}')" data-bs-toggle="modal"
                        data-bs-target="#modalOrderDetail">Chi tiết</button>
                </div>
            </div>
        `).join('');
        $('#content-orders .d-md-none').html(html || '<p class="text-center">Không có đơn hàng nào</p>');
    };

    window.viewOrderDetail = function (orderId) {
        $.ajax({
            url: `/api/admin/orders/${orderId}`,
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    const {
                        order,
                        items,
                        invoiceCalc
                    } = res;
                    window.currentOrderData = res;

                    $('#modalOrderDetail').attr('data-id', order._id);
                    $('#detailOrderId').text(`ORD-${order._id.slice(-6).toUpperCase()}`);

                    const $customerCard = $('#modalOrderDetail .card.bg-light');
                    $customerCard.find('span').eq(0).text(order.userId ?.name || 'N/A');
                    $customerCard.find('span').eq(1).text(order.phone);
                    $customerCard.find('span').eq(2).text(order.address);

                    $('#updateStatusSelect').val(order.status);
                    $('#paymentStatusSwitch').prop('checked', order.paymentStatus === 'paid');

                    let itemsHtml = items.map(item => `
                        <tr>
                            <td>
                                <div class="fw-bold small">${item.productId?.name || 'Sản phẩm đã xóa'}</div>
                                <div class="text-muted" style="font-size: 10px;">SKU: ${item.sku}</div>
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-end">${Number(item.price).toLocaleString()}đ</td>
                            <td class="text-end fw-bold">${Number(item.total).toLocaleString()}đ</td>
                        </tr>
                    `).join('');
                    $('#modalOrderDetail tbody').html(itemsHtml);
                    $('#modalOrderDetail tfoot .text-danger').text(Number(order.totalAmount).toLocaleString() + 'đ');
                }
            }
        });
    };

    window.saveOrderChange = function () {
        const orderId = $('#modalOrderDetail').attr('data-id');
        const data = {
            status: $('#updateStatusSelect').val(),
            paymentStatus: $('#paymentStatusSwitch').is(':checked') ? 'paid' : 'unpaid'
        };

        $.ajax({
            url: `/api/admin/orders/update/${orderId}`,
            type: 'PUT',
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("Cập nhật trạng thái đơn hàng thành công!");
                    bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail')).hide();
                    loadOrders();
                }
            }
        });
    };

    window.printOrderBill = function () {
        if (!window.currentOrderData) return;
        const {
            order,
            items,
            invoiceCalc
        } = window.currentOrderData;

        $('#p-order-id').text(`ORD-${order._id.slice(-6).toUpperCase()}`);
        $('#p-date').text(new Date(order.createdAt).toLocaleDateString('vi-VN'));
        $('#p-name').text(order.userId ?.name || 'N/A');
        $('#p-phone').text(order.phone);
        $('#p-address').text(order.address);
        $('#p-method').text(order.paymentMethod === 'cod' ? 'Tiền mặt' : 'Chuyển khoản');

        let pItemsHtml = items.map((item, index) => {
            const itemSubtotal = Math.round(item.total / 1.1);
            return `
            <tr class="text-center">
                <td>${index + 1}</td>
                <td class="text-start">${item.productId?.name}</td>
                <td>Cái</td>
                <td>${item.quantity}</td>
                <td>${Math.round(item.price / 1.1).toLocaleString()}</td>
                <td>${itemSubtotal.toLocaleString()}</td>
            </tr>`;
        }).join('');
        $('#p-items-body').html(pItemsHtml);

        $('#p-subtotal').text(invoiceCalc.amountNotVAT.toLocaleString() + 'đ');
        $('#p-tax').text(invoiceCalc.vatAmount.toLocaleString() + 'đ');
        $('#p-total').text(invoiceCalc.totalAmount.toLocaleString() + 'đ');

        window.print();
    };

    function getStatusBadge(status) {
        const badges = {
            pending: '<span class="badge bg-warning-subtle text-warning rounded-pill">Chờ xác nhận</span>',
            confirmed: '<span class="badge bg-info-subtle text-info rounded-pill">Đã xác nhận</span>',
            shipping: '<span class="badge bg-primary-subtle text-primary rounded-pill">Đang giao</span>',
            completed: '<span class="badge bg-success-subtle text-success rounded-pill">Hoàn thành</span>',
            cancelled: '<span class="badge bg-danger-subtle text-danger rounded-pill">Đã hủy</span>'
        };
        return badges[status] || badges.pending;
    }

    function getStatusBorder(status) {
        const borders = {
            pending: 'border-warning',
            confirmed: 'border-info',
            shipping: 'border-primary',
            completed: 'border-success',
            cancelled: 'border-danger'
        };
        return borders[status] || 'border-secondary';
    }

    $('#btnExportOrder').on('click', function () {
        window.location.href = '/api/admin/orders/export/excel';
    });

    $('#filterOrderStatus').on('change', loadOrders);
    $('#content-orders input[type="text"]').on('input', loadOrders);

    loadOrders();
}