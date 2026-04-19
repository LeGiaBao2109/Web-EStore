import { formatPrice } from '../../../js/helpers/format.js';

const createProductHTML = (item, isGrid = false) => {
    const priceValue = item.priceId ? item.priceId.price : null;
    const displayPrice = priceValue ? formatPrice(priceValue) : "Liên hệ";
    const columnClass = isGrid ? 'col-6 col-md-4 col-lg-3 mb-4' : '';

    return `
        <div class="${columnClass} product-item">
            <div class="card h-100 border-0 shadow-sm">
                <a href="/products/${item.slug}">
                    <img src="${item.image.url}" class="card-img-top p-2" alt="${item.name}" style="height: 180px; object-fit: contain;">
                </a>
                <div class="card-body text-center p-2">
                    <h6 class="fw-bold mb-1" style="font-size: 0.9rem; min-height: 40px;">${item.name}</h6>
                    <p class="text-danger fw-bold mb-2">${displayPrice}</p>
                    <div class="buttons d-flex gap-1">
                        <a href="/products/${item.slug}" class="btn btn-outline-danger btn-sm rounded-pill w-100">Mua Ngay</a>
                        <button class="btn btn-danger btn-sm rounded-circle p-2 add-to-cart" data-id="${item._id}">
                            <i class="bi bi-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
};

export const initSearchResults = () => {
    const $container = $('#search-results-container');

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');
    
    if (!keyword) {
        $container.html('<div class="col-12 text-center py-5"><p>Vui lòng nhập từ khóa để tìm kiếm.</p></div>');
        return;
    }

    $container.html('<div class="text-center py-5"><span class="spinner-border"></span></div>');

    $.ajax({
        url: `/api/products/search?keyword=${encodeURIComponent(keyword)}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            $container.empty();
            
            if (response.success && response.data.length > 0) {
                const html = response.data.map(item => createProductHTML(item, true)).join('');
                $container.html(html);
            } else {
                $container.html(`
                    <div class="col-12 text-center py-5">
                        <h5>Không tìm thấy sản phẩm</h5>
                        <p class="text-muted">Từ khóa: <strong>"${keyword}"</strong></p>
                    </div>
                `);
            }
        },
        error: function(error) {
            $container.html('<div class="col-12 text-center py-5"><p>Lỗi tải dữ liệu. Vui lòng thử lại.</p></div>');
        }
    });
};
