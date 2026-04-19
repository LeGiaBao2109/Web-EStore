import {
    initNavbar
} from './utils/navbar.js';
import {
    initProductSlider
} from './utils/slider.js';
import {
    initProductList,
    initProductGrid
} from './pages/product-list.js';
import {
    initAuth
} from './pages/auth.js';

$(async function () {

    initNavbar();

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

    initProductGrid();
    initAuth();

    $('#search-form').on('submit', function (e) {
        e.preventDefault();
        const keyword = $('#search-input').val().trim();
        if (keyword) {
            window.location.href = `/products/search?keyword=${encodeURIComponent(keyword)}`;
        }
    });
});