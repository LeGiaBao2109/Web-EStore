export function initCustomers() {
    const loadCustomers = () => {
        const search = $('#content-customers input[type="text"]').val();
        $.ajax({
            url: `/api/admin/customers?search=${search}`,
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    renderCustomerTable(res.customers);
                    renderCustomerCards(res.customers);
                }
            }
        });
    };

    const renderCustomerTable = (customers) => {
        let html = customers.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-3" 
                             style="width: 40px; height: 40px; font-weight: bold;">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold">${user.name}</h6>
                            <small class="text-muted">@${user.username}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="small"><i class="bi bi-envelope me-1"></i> ${user.email}</div>
                    <div class="small"><i class="bi bi-phone me-1"></i> ${user.phone || 'Chưa cập nhật'}</div>
                </td>
                <td>
                    <div class="text-truncate small" style="max-width: 200px;">${user.address || 'Chưa có địa chỉ'}</div>
                </td>
                <td class="text-center">
                    <span class="badge ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill">
                        ${user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border-0 me-2" onclick="editCustomer('${user._id}')">
                        <i class="bi bi-pencil-square text-primary"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-light border-0" onclick="toggleUserStatus('${user._id}', '${user.status}')">
                        <i class="bi ${user.status === 'active' ? 'bi-lock text-danger' : 'bi-unlock text-success'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        $('#content-customers table tbody').html(html || '<tr><td colspan="5" class="text-center">Không tìm thấy khách hàng</td></tr>');
    };

    const renderCustomerCards = (customers) => {
        let html = customers.map(user => `
            <div class="card border-0 shadow-sm rounded-4 p-3 mb-3">
                <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-3" style="width: 45px; height: 45px; font-weight: bold;">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-0 fw-bold">${user.name}</h6>
                        <span class="badge ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} small">${user.status}</span>
                    </div>
                </div>
                <div class="small mb-3">
                    <p class="mb-1"><i class="bi bi-envelope me-2"></i>${user.email}</p>
                    <p class="mb-1"><i class="bi bi-phone me-2"></i>${user.phone || 'N/A'}</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm rounded-3 flex-fill" onclick="editCustomer('${user._id}')">Sửa</button>
                    <button class="btn btn-outline-danger btn-sm rounded-3 flex-fill" onclick="toggleUserStatus('${user._id}', '${user.status}')">
                        ${user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                </div>
            </div>
        `).join('');
        $('#content-customers .d-md-none').html(html || '<p class="text-center">Trống</p>');
    };

    window.toggleUserStatus = function (userId, currentStatus) {
        const action = currentStatus === 'active' ? 'khóa' : 'mở khóa';
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            $.ajax({
                url: `/api/admin/customers/toggle-status/${userId}`,
                type: 'PATCH',
                success: function (res) {
                    if (res.success) {
                        loadCustomers();
                    }
                }
            });
        }
    };

    window.editCustomer = function (userId) {
        $.ajax({
            url: `/api/admin/customers/${userId}`,
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    const user = res.user;
                    $('#editUserId').val(user._id);
                    $('#editCustomerName').val(user.name);
                    $('#editCustomerPhone').val(user.phone);
                    $('#editCustomerStatus').val(user.status);
                    $('#editCustomerAddress').val(user.address);
                    new bootstrap.Modal(document.getElementById('modalEditCustomer')).show();
                }
            }
        });
    };

    window.saveCustomerEdit = function () {
        const id = $('#editUserId').val();
        const data = {
            name: $('#editCustomerName').val(),
            phone: $('#editCustomerPhone').val(),
            status: $('#editCustomerStatus').val(),
            address: $('#editCustomerAddress').val()
        };

        if (!data.name) return alert("Tên không được để trống!");

        $.ajax({
            url: `/api/admin/customers/update/${id}`,
            type: 'PUT',
            data: data,
            success: function (res) {
                if (res.success) {
                    bootstrap.Modal.getInstance(document.getElementById('modalEditCustomer')).hide();
                    loadCustomers();
                }
            }
        });
    };

    $('#content-customers input[type="text"]').on('input', loadCustomers);
    loadCustomers();
}