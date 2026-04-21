export const initCartActions = () => {
    $(document).on('click', '.add-to-cart', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        const productId = $btn.data('id') || $('.js-product-id').val();

        if (productId && !$btn.prop('disabled')) {
            $btn.prop('disabled', true);
            handleAddToCart(productId, 1, () => {
                $btn.prop('disabled', false);
            });
        }
    });

    $(document).on('click', '#btn-checkout-cart', function (e) {
        e.preventDefault();
        localStorage.setItem('checkout_type', 'cart');
        localStorage.removeItem('buy_now_id');
        window.location.href = $(this).attr('href');
    });
};

function handleAddToCart(productId, quantity, callback) {
    $.ajax({
        url: '/api/cart/add',
        type: 'POST',
        data: { productId, quantity },
        success: function (res) {
            if (res.success) {
                const $badge = $('.bi-cart').closest('a').find('.badge');
                if ($badge.length) $badge.text(res.cartCount);
            } else {
                alert(res.message);
                if (res.message === "Vui lòng đăng nhập để mua hàng!") {
                    window.location.href = '/auth';
                }
            }
        },
        error: function () {
            alert("Lỗi kết nối server!");
        },
        complete: function () {
            if (callback) callback();
        }
    });
}