export const initUserProfile = () => {
    const loadUserData = () => {
        $.ajax({
            url: '/api/user/profile',
            method: 'GET',
            success: (res) => {
                if (res.success && res.user) {
                    const user = res.user;
                    
                    $('#display-name').text(user.name || "Khách hàng");
                    $('#u-username').text(user.username || "N/A");
                    $('#u-email').text(user.email || "N/A");
                    $('#u-phone').text(user.phone || "N/A");
                    $('#u-address').text(user.address || "Chưa cập nhật địa chỉ");

                    $('#editName').val(user.name);
                    $('#editEmail').val(user.email);
                    $('#editPhone').val(user.phone);
                    $('#editAddress').val(user.address);
                }
            },
            error: (err) => console.error("Lỗi tải thông tin người dùng:", err)
        });
    };

    const loadOrderHistory = () => {
    $.ajax({
        url: '/api/user/orders',
        method: 'GET',
        success: (res) => {
            if (res.success && res.orders) {
                const $tableBody = $('#order-history-table'); 
                $tableBody.empty();

                if (res.orders.length === 0) {
                    $tableBody.append('<tr><td colspan="6" class="text-center py-4">Bạn chưa có đơn hàng nào</td></tr>');
                    return;
                }

                res.orders.forEach((order, index) => {
                    const statusClass = getStatusClass(order.status);
                    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
                    
                    const firstItemName = order.items && order.items.length > 0 && order.items[0].productId 
                                          ? order.items[0].productId.name 
                                          : 'Sản phẩm không xác định';

                    $tableBody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div>
                                        <div class="fw-bold small">${firstItemName}</div>
                                        <div class="text-muted" style="font-size: 10px;">Mã đơn: ${order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge ${statusClass}">${translateStatus(order.status)}</span></td>
                            <td class="small">${orderDate}</td>
                            <td class="fw-bold text-danger">${order.totalAmount.toLocaleString()} đ</td>
                            <td class="text-center">
                                <a href="/user-profile/order-history/${order._id}" class="btn btn-sm btn-light border rounded-pill px-3">Chi tiết</a>
                            </td>
                        </tr>
                    `);
                });
                
                $('.badge.bg-danger.rounded-pill').text(`${res.orders.length} đơn hàng`);
            }
        },
        error: (err) => console.error("Lỗi tải đơn hàng:", err)
    });
};

    $('#modalUpdate .btn-danger').on('click', function() {
        const btn = $(this);
        const updatedData = {
            name: $('#editName').val().trim(),
            email: $('#editEmail').val().trim(),
            phone: $('#editPhone').val().trim(),
            address: $('#editAddress').val().trim()
        };

        if (!updatedData.name || !updatedData.email) {
            alert("Vui lòng không để trống tên và email!");
            return;
        }

        btn.prop('disabled', true).text('Đang lưu...');

        $.ajax({
            url: '/api/user/update-profile',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: (res) => {
                if (res.success) {
                    alert("Cập nhật thông tin thành công!");
                    loadUserData();
                    $('#modalUpdate').modal('hide');
                } else {
                    alert(res.message || "Có lỗi xảy ra");
                }
            },
            complete: () => btn.prop('disabled', false).text('Lưu thay đổi'),
            error: () => alert("Lỗi kết nối máy chủ!")
        });
    });

    $('#modalPass .btn-danger').on('click', function() {
        const btn = $(this);
        const oldPassword = $('#modalPass input[placeholder="Mật khẩu hiện tại"]').val();
        const newPassword = $('#modalPass input[placeholder="Mật khẩu mới"]').val();
        const confirmPassword = $('#modalPass input[placeholder="Xác nhận mật khẩu mới"]').val();

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ các trường mật khẩu!");
            return;
        }

        if (oldPassword === newPassword) {
            alert("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        btn.prop('disabled', true).text('Đang xử lý...');

        $.ajax({
            url: '/api/user/change-password',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ oldPassword, newPassword }),
            success: (res) => {
                if (res.success) {
                    alert("Đổi mật khẩu thành công!");
                    $('#modalPass').modal('hide');
                    $('#modalPass input').val('');
                } else {
                    alert(res.message || "Mật khẩu hiện tại không đúng!");
                }
            },
            complete: () => btn.prop('disabled', false).text('Xác nhận đổi'),
            error: () => alert("Lỗi kết nối hệ thống!")
        });
    });

    $('#btnLogout').on('click', function(e) {
        e.preventDefault();
        if (confirm("Bạn có chắc muốn đăng xuất không?")) {
            $.post('/api/auth/logout', (res) => {
                if (res.success) {
                    window.location.href = "/";
                }
            });
        }
    });

    const getStatusClass = (status) => {
        const classes = {
            'pending': 'bg-warning text-dark',
            'shipping': 'status-shipping-tag',
            'completed': 'bg-success',
            'cancelled': 'bg-secondary'
        };
        return classes[status] || 'bg-info';
    };

    const translateStatus = (status) => {
        const titles = {
            'pending': 'Chờ xử lý',
            'shipping': 'Đang giao',
            'completed': 'Đã hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return titles[status] || status;
    };

    loadUserData();
    loadOrderHistory();
};