import { initNavbar } from './utils/navbar.js';
import { initProductSlider } from './utils/slider.js';
import { initProductList } from './pages/product-list.js';

$(function () {
    initNavbar();

    const productSlider = initProductSlider('productSlider');
    if (productSlider) {
        $('.next-btn').on('click', function (e) {
            e.preventDefault();
            productSlider.slide(1);
        });
        $('.prev-btn').on('click', function (e) {
            e.preventDefault();
            productSlider.slide(-1);
        });
    }

    initProductList();
});