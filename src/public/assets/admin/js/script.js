import { initDashboardCharts } from './pages/dashboard.js';
import { initProducts } from './pages/product.js';
import { initOrders } from './pages/order.js';
import { initCustomers } from './pages/customer.js';

$(function () {
    initDashboardCharts();
    initProducts();
    initOrders();
    initCustomers();

    $('#btnGlobalFilter').on('click', function () {
        const fromDate = $('#globalDateFrom').val();
        const toDate = $('#globalDateTo').val();
        console.log(`Lọc dữ liệu từ ${fromDate} đến ${toDate}`);
    });
});