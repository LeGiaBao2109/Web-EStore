import { initNavbar } from './utils/navbar.js';
import { initProductSlider } from './utils/slider.js';
import { initProductList, initProductGrid } from './pages/product-list.js';
import { initProductDetail } from './pages/product-detail.js';
import { initCartActions } from './pages/cart.js';
import { initCartPage } from './pages/cart-page.js';
import { initPaymentPage } from './pages/payment.js';
import { initAuth } from './pages/auth.js';
import { initUserProfile } from './pages/user-profile.js';

$(async function () {
    initNavbar();
    initAuth();
    initCartActions();

    const path = window.location.pathname;

    if (path === '/' || path === '/index.html') {
        const isDataLoaded = await initProductList();
        if (isDataLoaded) {
            const productSlider = initProductSlider('productSlider');
            if (productSlider) {
                $('.next-btn').off('click').on('click', function (e) {
                    e.preventDefault();
                    productSlider.slide(1);
                });
                $('.prev-btn').off('click').on('click', function (e) {
                    e.preventDefault();
                    productSlider.slide(-1);
                });
            }
        }
    }

    if (path.includes('/products/detail/')) {
        initProductDetail();
    } else if (path.includes('/products/')) {
        initProductGrid();
    }

    if (path.includes('/cart') && !path.includes('/payment')) {
        initCartPage();
    }

    if (path.includes('/cart/payment')) {
        initPaymentPage();
    }

    if (path.includes('/user-profile')) {
        initUserProfile();
    }

    $('#search-form').on('submit', function (e) {
        e.preventDefault();
        const keyword = $('#search-input').val().trim();
        if (keyword) {
            window.location.href = `/products/search?keyword=${encodeURIComponent(keyword)}`;
        }
    });

    $.get('/api/auth/me', function (res) {
        if (res.success) {
            $('#auth-header-area').find('a[href="/cart"]').addClass('d-none');

            const $userIcon = $('.js-header-user');
            if ($userIcon.length > 0) {
                const firstName = (res.user.name || "User").split(' ').pop();

                $userIcon.replaceWith(`
                    <div class="dropdown d-flex align-items-center ms-2">
                        <a class="btn btn-danger rounded-pill px-3 py-1 d-flex align-items-center dropdown-toggle border-0 shadow-sm" 
                           href="#" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #c82333;">
                            <i class="bi bi-person-circle me-2"></i>
                            <span class="small fw-bold">${firstName}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                            <li><a class="dropdown-item py-2" href="/user-profile"><i class="bi bi-person me-2"></i>Hồ sơ</a></li>
                            <li><a class="dropdown-item py-2" href="/cart"><i class="bi bi-cart me-2"></i>Giỏ hàng của tôi</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item py-2 text-danger" href="#" id="btnLogout"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
                        </ul>
                    </div>
                `);
            }
        }
    });

    $(document).on('click', '#btnLogout', function (e) {
        e.preventDefault();
        $.post('/api/auth/logout', function (res) {
            if (res.success) {
                window.location.href = '/auth';
            }
        });
    });
});