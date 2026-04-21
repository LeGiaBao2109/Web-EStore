import { formatPrice } from '../../../js/helpers/format.js';

const categoryBrands = {
    "dien-thoai": ["Apple", "Samsung", "Xiaomi", "Vivo", "Oppo", "Realme", "Nokia"],
    "tablet": ["Apple", "Samsung", "Xiaomi"],
    "laptop": ["Apple", "Asus", "Dell", "HP", "MSI"],
    "man-hinh": ["Samsung", "LG", "Asus", "Dell"],
    "phu-kien": ["Apple", "Sony", "JBL", "Logitech"],
    "gia-dung": ["Panasonic", "Sunhouse", "Philips"]
};

const createProductHTML = (item, isGrid = false) => {
    const priceValue = item.priceId ? item.priceId.price : null;
    const displayPrice = priceValue ? formatPrice(priceValue) : "Liên hệ";
    const columnClass = isGrid ? 'col-6 col-md-4 col-lg-3 mb-4' : '';

    return `
        <div class="${columnClass} product-item">
            <div class="card h-100 border-0 shadow-sm">
                <a href="/products/detail/${item.slug}">
                    <img src="${item.image.url}" class="card-img-top p-2" alt="${item.name}" style="height: 180px; object-fit: contain;">
                </a>
                <div class="card-body text-center p-2">
                    <h6 class="fw-bold mb-1" style="font-size: 0.9rem; min-height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${item.name}
                    </h6>
                    <p class="text-danger fw-bold mb-2">${displayPrice}</p>
                    <div class="buttons d-flex gap-1">
                        <button class="btn btn-outline-danger btn-sm rounded-pill w-100 py-2 btn-buy-now" data-id="${item._id}">
                            Mua Ngay
                        </button>
                        <button class="btn btn-danger btn-sm rounded-circle p-2 add-to-cart" data-id="${item._id}">
                            <i class="bi bi-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
};

const renderBrandNav = (category) => {
    const brands = categoryBrands[category] || [];
    const $brandNav = $('.nav-brands');
    if (!$brandNav.length) return;

    let html = `
        <li class="nav-item">
            <a href="/products/${category}" class="nav-link text-white fw-bold text-uppercase active-brand">TẤT CẢ</a>
        </li>`;

    html += brands.map(brand => `
        <li class="nav-item">
            <a href="/products/${category}/brand/${brand.toLowerCase()}" class="nav-link text-white fw-bold text-uppercase">
                ${brand.toUpperCase()}
            </a>
        </li>
    `).join('');

    $brandNav.html(html);
};

export const initProductList = async () => {
    const $productSlider = $('#productSlider');
    if (!$productSlider.length) return;

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword') || '';

    try {
        const res = await $.get("/api/products/get-products", {
            keyword: keyword
        });
        if (res.success) {
            $productSlider.html(res.data.map(item => createProductHTML(item)).join(''));
            return true;
        }
    } catch (e) {
        console.error(e);
    }
};

export const initProductGrid = () => {
    const $gridContainer = $('#product-container');
    if (!$gridContainer.length) return;

    const getParamsFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('keyword') || '';
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p !== "");
        const isSearchPage = parts[1] === 'search';
        const category = isSearchPage ? '' : (parts[1] || '');
        const brandIndex = parts.indexOf('brand');
        const brand = (brandIndex !== -1 && parts[brandIndex + 1]) ? parts[brandIndex + 1] : '';

        return { category, brand, keyword };
    };

    const fetchProducts = async () => {
        const { category, brand, keyword } = getParamsFromUrl();
        const selectedPrices = $('.filter-price:checked').map(function () { return $(this).val(); }).get();
        const sort = $('#sortPrice').val();

        if (category) renderBrandNav(category);

        let displayTitle = 'SẢN PHẨM';
        if (keyword) displayTitle = `KẾT QUẢ CHO: "${keyword.toUpperCase()}"`;
        else if (brand) displayTitle = brand.toUpperCase();
        else if (category) displayTitle = category.replace('-', ' ').toUpperCase();

        $('h4.fw-bold.mb-0').text(displayTitle);

        try {
            $gridContainer.css('opacity', '0.5');
            const response = await $.ajax({
                url: `/api/products/get-products`,
                method: "GET",
                data: {
                    category: category,
                    keyword: keyword,
                    brand: brand,
                    sortPrice: sort !== 'default' ? sort : '',
                    priceRanges: selectedPrices
                },
                traditional: true
            });

            $gridContainer.css('opacity', '1').empty();
            if (response.success && response.data.length > 0) {
                $gridContainer.html(response.data.map(item => createProductHTML(item, true)).join(''));
            } else {
                $gridContainer.html(`
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-search fs-1 text-secondary"></i>
                        <p class="mt-3 text-secondary">Không tìm thấy sản phẩm phù hợp.</p>
                    </div>`);
            }
        } catch (error) {
            $gridContainer.css('opacity', '1');
            console.error("Lỗi Fetch:", error);
        }
    };

    const syncMenuWithUrl = () => {
        const { brand } = getParamsFromUrl();
        $('.nav-brands .nav-link').removeClass('active-brand');
        if (brand) {
            $(`.nav-brands .nav-link`).each(function () {
                if ($(this).text().trim().toLowerCase() === brand.toLowerCase()) {
                    $(this).addClass('active-brand');
                }
            });
        } else {
            $('.nav-brands .nav-link').first().addClass('active-brand');
        }
    };

    $(document).off('click', '.nav-brands .nav-link').on('click', '.nav-brands .nav-link', function (e) {
        e.preventDefault();
        const brandText = $(this).text().trim().toLowerCase();
        const { category } = getParamsFromUrl();
        const newUrl = (brandText === 'tất cả') ? `/products/${category}` : `/products/${category}/brand/${brandText}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        syncMenuWithUrl();
        fetchProducts();
    });

    $(document).off('change', '.filter-price, #sortPrice').on('change', '.filter-price, #sortPrice', fetchProducts);

    window.addEventListener('popstate', () => {
        syncMenuWithUrl();
        fetchProducts();
    });

    syncMenuWithUrl();
    fetchProducts();
};

$(document).on('click', '.btn-buy-now', function(e) {
    e.preventDefault();
    const productId = $(this).data('id');
    if (productId) {
        localStorage.setItem('checkout_type', 'buy_now');
        localStorage.setItem('buy_now_id', productId);
        window.location.href = '/cart/payment';
    }
});

$(document).on('click', '.add-to-cart', async function(e) {
    e.preventDefault();
    const productId = $(this).data('id');
    try {
        const res = await $.post('/api/cart/add', { productId, quantity: 1 });
        if (res.success) {
            alert("Đã thêm vào giỏ hàng!");
            const $cartBadge = $('.bi-cart').closest('a').find('.badge');
            if ($cartBadge.length && res.cartCount) {
                $cartBadge.text(res.cartCount);
            }
        } else {
            alert(res.message || "Vui lòng đăng nhập!");
            if (res.message === "Vui lòng đăng nhập để mua hàng!") {
                window.location.href = '/auth';
            }
        }
    } catch (e) {
        console.error(e);
    }
});