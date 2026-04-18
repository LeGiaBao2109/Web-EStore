// /assets/admin/js/script.js
import {
    initDashboardCharts
} from './pages/dashboard.js';

$(function () {
    console.log("Admin Dashboard Ready với jQuery!");
    initDashboardCharts();

    // --- LOGIC SẢN PHẨM (ĐÃ CÓ) ---
    window.switchSubTab = function (target) {
        let tabTriggerEl;
        if (target === 'price') {
            tabTriggerEl = document.querySelector('button[data-bs-target="#subtab-price"]');
        } else if (target === 'warehouse') {
            tabTriggerEl = document.querySelector('button[data-bs-target="#subtab-warehouse"]');
        }
        if (tabTriggerEl) {
            const tab = new bootstrap.Tab(tabTriggerEl);
            tab.show();
        }
    };

    window.viewProductDetail = function (productId) {
        console.log("Đang tải dữ liệu cho sản phẩm:", productId);
        const firstTabEl = document.querySelector('button[data-bs-target="#subtab-info"]');
        if (firstTabEl) {
            const firstTab = new bootstrap.Tab(firstTabEl);
            firstTab.show();
        }
    };

    window.updatePrice = function () {
        const newPrice = $('#newPrice').val();
        const reason = $('#priceReason').val();
        if (!newPrice) {
            alert("Vui lòng nhập giá mới!");
            return;
        }

        const now = new Date().toLocaleDateString('vi-VN');
        const newRow = `
            <tr>
                <td class="small">${now}</td>
                <td class="fw-bold text-danger">${Number(newPrice).toLocaleString()}đ</td>
                <td>${reason || 'Cập nhật định kỳ'}</td>
                <td class="small">Lê Gia Bảo</td>
                <td class="text-center text-success"><i class="bi bi-check-circle-fill"></i></td>
            </tr>`;
        $('#priceHistoryBody i.bi-check-circle-fill').remove();
        $('#priceHistoryBody').prepend(newRow);
        $('#newPrice').val('');
        $('#priceReason').val('');
        alert("Cập nhật giá thành công!");
    };

    window.updateWarehouse = function () {
        const type = $('#logType').val();
        const qty = $('#logQty').val();
        const note = $('#logNote').val();
        if (!qty || qty <= 0) {
            alert("Số lượng phải lớn hơn 0!");
            return;
        }

        const now = new Date().toLocaleDateString('vi-VN');
        const badgeClass = type === 'import' ? 'bg-success' : 'bg-danger';
        const typeText = type === 'import' ? 'Nhập kho' : 'Xuất kho';
        const qtyPrefix = type === 'import' ? '+' : '-';
        const qtyClass = type === 'import' ? 'text-success' : 'text-danger';

        const newLogRow = `
            <tr>
                <td class="small">${now}</td>
                <td><span class="badge ${badgeClass}">${typeText}</span></td>
                <td class="fw-bold ${qtyClass}">${qtyPrefix}${qty}</td>
                <td>${note || 'Giao dịch kho'}</td>
                <td class="small">Lê Gia Bảo</td>
            </tr>`;
        $('#warehouseHistoryBody').prepend(newLogRow);
        $('#logQty').val('');
        $('#logNote').val('');
        alert("Ghi sổ kho thành công!");
    };

    // --- LOGIC ĐƠN HÀNG (VIẾT THÊM) ---

    // 1. Xem chi tiết đơn hàng
    window.viewOrderDetail = function (orderId) {
        console.log("Đang xem đơn hàng:", orderId);
        // Sau này Bảo dùng AJAX lấy data từ Schema ORDERS & ORDER_ITEMS
        // Tạm thời set cứng ID lên Modal
        $('#detailOrderId').text(orderId);
    };

    // 2. Lưu thay đổi trạng thái đơn hàng (Xác nhận đơn)
    window.saveOrderChange = function () {
        const status = $('#updateStatusSelect').val();
        const isPaid = $('#paymentStatusSwitch').is(':checked');

        console.log("Cập nhật trạng thái đơn hàng:", {
            status,
            isPaid
        });
        // Thực hiện gọi API cập nhật status tại đây

        alert("Cập nhật trạng thái đơn hàng thành công!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalOrderDetail'));
        modal.hide();
    };

    // 3. Logic IN HÓA ĐƠN (Chuẩn CellphoneS)
    window.printOrderBill = function () {
        // Lấy dữ liệu từ UI đổ vào bản in ẩn
        const orderId = $('#detailOrderId').text();
        const customerName = "Lê Gia Bảo"; // Giả định từ UI/DB
        const total = 34500000; // Tổng tiền cuối cùng từ Schema ORDERS

        // Tính toán thuế VAT 10% ngược từ tổng tiền
        const subtotal = Math.round(total / 1.1);
        const tax = total - subtotal;

        // Cập nhật các trường thông tin trên Layout In (#print-section)
        $('#p-order-id').text(orderId);
        $('#p-date').text(new Date().toLocaleDateString('vi-VN'));
        $('#p-name').text(customerName);
        $('#p-subtotal').text(subtotal.toLocaleString() + 'đ');
        $('#p-tax').text(tax.toLocaleString() + 'đ');
        $('#p-total').text(total.toLocaleString() + 'đ');

        // Gọi lệnh in của trình duyệt
        // CSS @media print sẽ lo việc ẩn UI chính và hiện Bill
        window.print();
    };

    // --- LOGIC CHUNG ---
    $('#btnGlobalFilter').on('click', function () {
        const fromDate = $('#globalDateFrom').val();
        const toDate = $('#globalDateTo').val();
        console.log(`Đang lọc dữ liệu toàn hệ thống từ ${fromDate} đến ${toDate}`);
    });

    // Thay đổi trạng thái khách hàng (Active / Block)
    window.toggleUserStatus = function (userId, currentStatus) {
        const action = currentStatus === 'active' ? 'khoá' : 'mở khoá';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            console.log(`Đang thực hiện ${action} cho user: ${userId}`);

            // Sau này Bảo gọi API: 
            // patch(`/api/users/${userId}`, { status: currentStatus === 'active' ? 'block' : 'active' })

            alert(`Đã ${action} thành công!`);
            // Re-render data
        }
    };

    // Hàm mở modal và đổ dữ liệu khách hàng cũ vào form
    window.editCustomer = function (userId) {
        console.log("Đang lấy thông tin user ID:", userId);

        // Tạm thời set cứng dữ liệu mẫu theo Schema USERS
        $('#editUserId').val(userId);
        $('#editCustomerName').val("Lê Gia Bảo");
        $('#editCustomerPhone').val("0358356xxx");
        $('#editCustomerStatus').val("active");
        $('#editCustomerAddress').val("12 Nguyễn Văn Bảo, P.4, Gò Vấp, TP.HCM");

        // Hiện modal
        const modal = new bootstrap.Modal(document.getElementById('modalEditCustomer'));
        modal.show();
    };

    // Hàm lưu thông tin sau khi sửa
    window.saveCustomerEdit = function () {
        const id = $('#editUserId').val();
        const name = $('#editCustomerName').val();
        const status = $('#editCustomerStatus').val();

        if (!name) {
            alert("Tên khách hàng không được để trống!");
            return;
        }

        console.log("Gửi yêu cầu cập nhật lên Server cho User:", {
            id,
            name,
            status
        });

        // Sau này Bảo dùng: $.ajax({ url: `/api/users/${id}`, method: 'PUT', data: ... })

        alert("Cập nhật thông tin khách hàng thành công!");
        $('#modalEditCustomer').modal('hide');
        // Logic load lại danh sách khách hàng...
    };
});