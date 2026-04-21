export const initCartActions = () => {
    $(document).on('click', '.add-to-cart', function (e) {
        e.preventDefault();
        const productId = $(this).data('id');
        if (productId) {
            handleAddToCart(productId, 1);
        }
    });

    $(document).on('click', '.product__item--buttons .bi-cart', function (e) {
        e.preventDefault();
        const productId = $('.js-product-id').val();
        if (productId) {
            handleAddToCart(productId, 1);
        } else {
            alert("Đang tải dữ liệu sản phẩm, vui lòng đợi!");
        }
    });

    $(document).on('click', '#btn-checkout-cart', function (e) {
        e.preventDefault();
        localStorage.setItem('checkout_type', 'cart');
        localStorage.removeItem('buy_now_id');
        window.location.href = $(this).attr('href');
    });
};

function handleAddToCart(productId, quantity) {
    $.ajax({
        url: '/api/cart/add',
        type: 'POST',
        data: {
            productId: productId,
            quantity: quantity
        },
        success: function (res) {
            if (res.success) {
                alert("Đã thêm sản phẩm vào giỏ hàng!");
                const $cartBadge = $('.bi-cart').closest('a').find('.badge');
                if ($cartBadge.length) {
                    $cartBadge.text(res.cartCount);
                }
            } else {
                alert(res.message);
                if (res.message === "Vui lòng đăng nhập để mua hàng!") {
                    window.location.href = '/auth'; 
                }
            }
        },
        error: function () {
            alert("Lỗi kết nối server, không thể thêm vào giỏ hàng!");
        }
    });
}