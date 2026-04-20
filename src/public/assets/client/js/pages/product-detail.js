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

                $('.js-product-title').each(function() {
                    $(this).text(product.name);
                });

                $('.js-product-price').text(formatPrice(product.priceData.price));
                
                $('.js-product-image').attr({
                    'src': product.image.url,
                    'alt': product.name
                });

                $('.js-product-desc').html(product.description);
                
                document.title = `${product.name} | E-STORE`;
            }
        },
        error: function (xhr) {
            console.error("Lỗi kết nối API chi tiết sản phẩm");
        }
    });
}