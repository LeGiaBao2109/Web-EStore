export function initOrders() {
    window.viewOrderDetail = function (orderId) {
        $('#detailOrderId').text(orderId);
    };

    window.saveOrderChange = function () {
        alert("Cập nhật trạng thái đơn hàng thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail')).hide();
    };

    window.printOrderBill = function () {
        const orderId = $('#detailOrderId').text();
        const total = 34500000;
        const subtotal = Math.round(total / 1.1);
        const tax = total - subtotal;
        $('#p-order-id').text(orderId);
        $('#p-date').text(new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text("Lê Gia Bảo");
        $('#p-subtotal').text(subtotal.toLocaleString() + 'đ');
        $('#p-tax').text(tax.toLocaleString() + 'đ');
        $('#p-total').text(total.toLocaleString() + 'đ');
        window.print();
    };
}