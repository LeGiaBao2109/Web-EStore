import {
    formatPrice
} from '../../../js/helpers/format.js';

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

export const initProductList = async () => {
    const $productSlider = $('#productSlider');
    if (!$productSlider.length) return;
    try {
        const res = await $.get("/api/products/get-products");
        if (res.success) $productSlider.html(res.data.map(item => createProductHTML(item)).join(''));
    } catch (e) {
        console.error(e);
    }
};

export const initProductGrid = () => {
    const $gridContainer = $('#product-container');
    if (!$gridContainer.length) return;

    const fetchProducts = async () => {
        const selectedPrices = $('.filter-price:checked').map(function () {
            return $(this).val();
        }).get();
        const brandText = $('.nav-brands .nav-link.active-brand').text().trim();
        const sort = $('#sortPrice').val();

        try {
            $gridContainer.css('opacity', '0.5');

            const formData = new FormData();
            selectedPrices.forEach(price => formData.append('priceRanges[]', price));
            if (brandText && brandText !== 'TẤT CẢ') formData.append('brand', brandText);
            if (sort && sort !== 'default') formData.append('sortPrice', sort);

            const response = await $.ajax({
                url: `/api/products/get-products`,
                method: "GET",
                data: Object.fromEntries(formData),
                traditional: true
            });

            $gridContainer.css('opacity', '1').empty();
            if (response.success && response.data.length > 0) {
                $gridContainer.html(response.data.map(item => createProductHTML(item, true)).join(''));
            } else {
                $gridContainer.html('<div class="col-12 text-center py-5"><p>Không tìm thấy sản phẩm phù hợp.</p></div>');
            }
        } catch (error) {
            console.error(error);
        }
    };

    $(document).off('change', '.filter-price, #sortPrice').on('change', '.filter-price, #sortPrice', fetchProducts);
    fetchProducts();
};