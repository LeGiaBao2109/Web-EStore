import { initNavbar } from './utils/navbar.js';
import { initProductSlider } from './utils/slider.js';
import { initProductList } from './pages/product-list.js';
import { initAuth } from './pages/auth.js';
import { initOrderHistory } from './pages/order-history.js';

$(function () {
    initNavbar();

    const productSlider = initProductSlider('productSlider');
    if (productSlider) {
        $('.next-btn').on('click', (e) => {
            e.preventDefault();
            productSlider.slide(1);
        });
        $('.prev-btn').on('click', (e) => {
            e.preventDefault();
            productSlider.slide(-1);
        });
    }

    initProductList();
    initAuth();
    initOrderHistory();
    console.log("E-Store System Ready!");
});