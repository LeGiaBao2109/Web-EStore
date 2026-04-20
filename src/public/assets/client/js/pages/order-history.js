export const prepareReview = (name) => {
    const modalTitle = document.getElementById('modalProductName');
    const textArea = document.getElementById('reviewText');
    
    if (modalTitle) modalTitle.innerText = name;
    if (textArea) textArea.value = '';
};

export const submitReview = () => {
    const name = document.getElementById('modalProductName')?.innerText;
    const content = document.getElementById('reviewText')?.value;

    if (!content || !content.trim()) {
        alert("Vui lòng nhập nội dung đánh giá!");
        return;
    }

    const submitBtn = document.getElementById('btn-submit-review');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Đang gửi...';

    $.ajax({
        url: '/api/user/reviews/add', // Sửa đường dẫn để khớp với user.api.js
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            productName: name,
            content: content.trim()
        }),
        success: (res) => {
            if (res.success) {
                alert("Gửi đánh giá thành công!");
                const modalElement = document.getElementById('reviewModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            } else {
                alert("Lỗi: " + res.message);
            }
        },
        error: () => alert("Không thể kết nối đến máy chủ."),
        complete: () => {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Gửi đánh giá';
        }
    });
};

export const initOrderHistoryDetail = () => {
    window.prepareReview = prepareReview;

    const submitBtn = document.getElementById('btn-submit-review');
    if (submitBtn) {
        $(submitBtn).off('click').on('click', submitReview);
    }

    const pathArray = window.location.pathname.split('/');
    const orderId = pathArray[pathArray.length - 1];

    const translateStatus = (status) => {
        const titles = { 
            'pending': 'Chờ xử lý', 
            'confirmed': 'Đã xác nhận', 
            'shipping': 'Đang giao hàng', 
            'completed': 'Thành công', 
            'cancelled': 'Đã hủy' 
        };
        return titles[status] || status;
    };

    const getStatusClass = (status) => {
        const classes = { 
            'pending': 'bg-warning text-dark', 
            'confirmed': 'bg-info text-white', 
            'shipping': 'bg-primary text-white', 
            'completed': 'bg-success text-white', 
            'cancelled': 'bg-secondary text-white' 
        };
        return classes[status] || 'bg-dark text-white';
    };

    const renderData = (order) => {
        $('#order-id-display').html(`<i class="bi bi-box-seam me-2 text-danger"></i> Chi tiết đơn hàng #EST${order._id.slice(-8).toUpperCase()}`);
        
        $('#order-status-display')
            .text(translateStatus(order.status))
            .attr('class', `badge ${getStatusClass(order.status)} rounded-pill px-3 py-2`);

        $('#order-user-name').text(order.userId?.name || "Khách hàng");
        $('#order-phone').text(order.phone || "---");
        $('#order-email').text(order.userId?.email || "---");
        $('#order-date').text(new Date(order.createdAt).toLocaleString('vi-VN'));
        $('#order-address').text(order.address || "---");
        $('#order-payment-method').text(order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản');
        $('#order-note').text(order.note ? `"${order.note}"` : "Không có ghi chú");

        const $itemContainer = $('#order-items-list');
        $itemContainer.empty();

        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const product = item.productId || {};
                
                // Lookup ảnh: Theo cấu trúc mới của bạn là product.image.url
                let imgUrl = '/assets/client/images/default.png';
                if (product.image && product.image.url) {
                    imgUrl = product.image.url;
                } else if (product.thumbnail) {
                    imgUrl = product.thumbnail;
                }

                $itemContainer.append(`
                    <div class="d-flex align-items-center mb-3 pb-3 border-bottom justify-content-between">
                        <div class="d-flex align-items-center">
                            <img src="${imgUrl}" class="rounded-3 border" style="width: 75px; height: 75px; object-fit: cover;" 
                                 onerror="this.src='https://placehold.co/75x75?text=No+Image'">
                            <div class="ms-3">
                                <h6 class="mb-0 fw-bold">${product.name || 'Sản phẩm'}</h6>
                                <small class="text-muted d-block mb-2">Số lượng: ${item.quantity}</small>
                                <button class="btn btn-outline-danger btn-sm rounded-pill px-3" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#reviewModal" 
                                        onclick="prepareReview('${product.name}')">
                                    <i class="bi bi-star-fill me-1"></i> Đánh giá
                                </button>
                            </div>
                        </div>
                        <div class="text-end fw-bold text-danger">
                            ${(item.price * item.quantity).toLocaleString()} đ
                        </div>
                    </div>
                `);
            });
        }

        $('#total-items-price').text(`${order.totalAmount.toLocaleString()} đ`);
        $('#total-amount-display').text(`${order.totalAmount.toLocaleString()} đ`);
    };

    const loadOrderDetail = () => {
        if (!orderId || orderId === ':id') return;

        $.ajax({
            url: `/api/user/order-history/${orderId}`,
            method: 'GET',
            success: (res) => {
                if (res.success && res.order) {
                    renderData(res.order);
                }
            }
        });
    };

    loadOrderDetail();
};