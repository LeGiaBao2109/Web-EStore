import { initNavbar } from './utils/navbar.js';
import { initProductSlider } from './utils/slider.js';
import { initProductList, initProductGrid } from './pages/product-list.js';
import { initAuth } from './pages/auth.js';

$(async function () {
    // 1. Khởi tạo UI cơ bản
    initNavbar();

    // 2. TẢI DATA TRƯỚC - CHẠY SLIDER SAU
    // Chúng ta phải đợi initProductList vẽ xong HTML vào #productSlider
    const isDataLoaded = await initProductList();

    if (isDataLoaded) {
        // Chỉ khởi tạo Slider khi đã có các thẻ .product-item bên trong
        const productSlider = initProductSlider('productSlider');
        
        if (productSlider) {
            $('.next-btn').off('click').on('click', function(e) {
                e.preventDefault();
                productSlider.slide(1);
            });
            $('.prev-btn').off('click').on('click', function(e) {
                e.preventDefault();
                productSlider.slide(-1);
            });
        }
    }

    // 3. Các thành phần khác
    initProductGrid();
    initAuth();

    console.log("E-Store System Ready!");
});