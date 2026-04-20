export const initPaymentPage = () => {
    const getCheckoutType = () => localStorage.getItem('checkout_type') || 'cart';
    const getBuyNowId = () => localStorage.getItem('buy_now_id');
    
    let checkoutItems = [];
    let subTotal = 0;
    const VAT_RATE = 0.1;

    const renderOrderSummary = (items, total) => {
        const $container = $('.order-items');
        if (!$container.length) return;

        $container.empty();
        
        if (!items || items.length === 0) {
            $container.append('<div class="text-center py-3">Không có sản phẩm nào</div>');
            return;
        }

        items.forEach(item => {
            const product = item.productId;
            if (!product) return;

            $container.append(`
                <div class="order-item-row mb-3 pb-3 border-bottom d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <img src="${product.image?.url || '/assets/client/images/default-product.png'}" 
                             class="rounded-3 border bg-white" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <div class="ms-3 flex-grow-1">
                        <h6 class="mb-0 fw-bold text-dark">${product.name || 'Sản phẩm'}</h6>
                        <small class="text-muted d-block">SKU: ${item.sku || product.slug || 'N/A'}</small>
                        <span class="qty-label small">Số lượng: ${item.quantity}</span>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-dark">${((item.price || 0) * item.quantity).toLocaleString()} đ</div>
                    </div>
                </div>`);
        });

        const currentTotal = total || 0;
        const vatAmount = currentTotal * VAT_RATE;
        const finalTotal = currentTotal + vatAmount;

        $('#sub-total').text(currentTotal.toLocaleString() + ' đ');
        $('#vat-amount').text(vatAmount.toLocaleString() + ' đ');
        $('#final-total').text(finalTotal.toLocaleString() + ' đ');
    };

    const loadData = () => {
        const type = getCheckoutType();
        const productId = getBuyNowId();

        $.ajax({
            url: '/api/payment/get-checkout-data',
            method: 'GET',
            data: { type, productId },
            success: (res) => {
                if (res.success && res.data) {
                    checkoutItems = res.data.items || [];
                    subTotal = res.data.totalAmount || 0;

                    if (res.user) {
                        $('#user-fullname').text(res.user.name || "Khách hàng");
                        $('#user-email').text(res.user.email || "N/A");
                        $('#user-phone').text(res.user.phone || "0358356268");
                    }
                    renderOrderSummary(checkoutItems, subTotal);
                } else {
                    $('.order-items').html(`<div class="alert alert-warning">${res.message || 'Không thể tải dữ liệu'}</div>`);
                }
            },
            error: (err) => {
                $('.order-items').html('<div class="alert alert-danger">Lỗi kết nối máy chủ</div>');
            }
        });
    };

    $(document).off('click', '#btn-submit-order').on('click', '#btn-submit-order', function(e) {
        e.preventDefault();
        const address = $('#fullAddress').val()?.trim();
        const note = $('#orderNote').val()?.trim() || "";
        const phone = $('#user-phone').text()?.trim();

        if (!address) {
            alert("Vui lòng nhập địa chỉ giao hàng!");
            $('#fullAddress').focus();
            return;
        }

        if (!checkoutItems || checkoutItems.length === 0) {
            alert("Đơn hàng không có sản phẩm!");
            return;
        }

        const btn = $(this);
        btn.prop('disabled', true).text('ĐANG XỬ LÝ...');

        const orderPayload = {
            type: getCheckoutType(),
            items: checkoutItems.map(item => ({
                productId: item.productId._id || item.productId,
                sku: item.sku || item.productId.slug || "N/A",
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: subTotal * (1 + VAT_RATE),
            address,
            phone,
            note,
            paymentMethod: 'cod'
        };

        $.ajax({
            url: '/api/order/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderPayload),
            success: (res) => {
                if (res.success) {
                    alert("Đặt hàng thành công!");
                    localStorage.removeItem('checkout_type');
                    localStorage.removeItem('buy_now_id');
                    window.location.href = '/';
                } else {
                    alert(res.message || "Có lỗi xảy ra");
                    btn.prop('disabled', false).text('XÁC NHẬN ĐẶT HÀNG');
                }
            },
            error: () => {
                alert("Lỗi kết nối hệ thống!");
                btn.prop('disabled', false).text('XÁC NHẬN ĐẶT HÀNG');
            }
        });
    });

    loadData();
};