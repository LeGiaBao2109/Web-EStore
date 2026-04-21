import { checkAuth, initLogout, initLogin } from './pages/auth.js';
import { initDashboardCharts } from './pages/dashboard.js';
import { initProducts } from './pages/product.js';
import { initOrders } from './pages/order.js';
import { initCustomers } from './pages/customer.js';

$(function () {
    if (window.location.pathname.includes('/admin/login')) {
        initLogin();
    } else {
        checkAuth(() => {
            initDashboardCharts();
            initProducts();
            initOrders();
            initCustomers();
            initLogout();

            $('#btnGlobalFilter').on('click', function () {
                const fromDate = $('#globalDateFrom').val();
                const toDate = $('#globalDateTo').val();
                console.log(`Lọc dữ liệu từ ${fromDate} đến ${toDate}`);
            });
        });
    }
});