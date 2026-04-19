export function initCustomers() {
    window.toggleUserStatus = function (userId, currentStatus) {
        const action = currentStatus === 'active' ? 'khoá' : 'mở khoá';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            alert(`Đã ${action} thành công!`);
        }
    };

    window.editCustomer = function (userId) {
        $('#editUserId').val(userId);
        $('#editCustomerName').val("Lê Gia Bảo");
        $('#editCustomerPhone').val("0358356268");
        $('#editCustomerStatus').val("active");
        $('#editCustomerAddress').val("12 Nguyễn Văn Bảo, P.4, Gò Vấp, TP.HCM");
        new bootstrap.Modal(document.getElementById('modalEditCustomer')).show();
    };

    window.saveCustomerEdit = function () {
        if (!$('#editCustomerName').val()) {
            alert("Tên khách hàng không được để trống!");
            return;
        }
        alert("Cập nhật thông tin khách hàng thành công!");
        bootstrap.Modal.getInstance(document.getElementById('modalEditCustomer')).hide();
    };
}