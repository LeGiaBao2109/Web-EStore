import { formatPrice } from '../../../js/helpers/format.js';

export async function initProductDetail() {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    if (!slug) return;

    $.ajax({
        url: `/api/products/detail/${slug}`,
        type: 'GET',
        success: function (res) {
            if (res.success && res.data) {
                const product = res.data;

                $('.js-product-id').val(product._id); 
                $('.js-product-title').text(product.name);
                $('.js-product-price').text(formatPrice(product.priceData.price));
                $('.js-product-image').attr({
                    'src': product.image.url,
                    'alt': product.name
                });
                $('.js-product-desc').html(product.description);
                document.title = `${product.name} | E-STORE`;

                renderReviews(product.reviews);
            }
        },
        error: function (xhr) {
            console.error("Lỗi kết nối API chi tiết sản phẩm");
        }
    });

    $(document).off('click', '.btn-danger.btn-lg').on('click', '.btn-danger.btn-lg', function() {
        const productId = $('.js-product-id').val();
        if (!productId) return;

        localStorage.setItem('checkout_type', 'buy_now');
        localStorage.setItem('buy_now_id', productId);

        window.location.href = '/cart/payment';
    });

    $(document).off('click', '.btn-outline-danger.btn-lg').on('click', '.btn-outline-danger.btn-lg', function() {
        const productId = $('.js-product-id').val();
        if (!productId) return;

        $.ajax({
            url: '/api/cart/add',
            type: 'POST',
            data: { 
                productId: productId,
                quantity: 1 
            },
            success: function(res) {
                if (res.success) {
                    alert("Đã thêm sản phẩm vào giỏ hàng!");
                } else {
                    alert(res.message || "Vui lòng đăng nhập để thêm vào giỏ hàng!");
                }
            },
            error: function() {
                alert("Không thể kết nối đến máy chủ!");
            }
        });
    });
}

function renderReviews(reviews) {
    const $reviewContainer = $('.product__item--reviews .review-list');
    if (!$reviewContainer.length) return;

    $reviewContainer.empty();

    if (!reviews || reviews.length === 0) {
        $reviewContainer.html('<p class="text-muted p-3 mb-0">Chưa có bình luận nào cho sản phẩm này.</p>');
        return;
    }

    const html = reviews.map(rev => {
        const name = rev.userName || "Khách Hàng";
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(-2);
        const date = new Date(rev.createdAt).toLocaleDateString('vi-VN');

        return `
            <div class="review-item p-3 mb-3 rounded-4 bg-white shadow-sm border">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-2" 
                             style="width: 35px; height: 35px; font-size: 0.8rem; flex-shrink: 0;">
                            ${initials}
                        </div>
                        <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.9rem;">${name}</h6>
                    </div>
                    <span class="text-muted" style="font-size: 0.75rem;">${date}</span>
                </div>
                <p class="text-secondary mb-0 ps-1" style="font-size: 0.9rem; border-left: 2px solid #f8d7da;">
                    ${rev.comment}
                </p>
            </div>`;
    }).join('');

    $reviewContainer.html(html);
}