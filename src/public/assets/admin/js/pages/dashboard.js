// /assets/admin/js/dashboard.js
let revenueChart, categoryChart;

export function initDashboardCharts() {
    renderRevenueChart();
    renderCategoryChart();

    // Sự kiện khi nhấn nút Lọc
    $('#btnFilterDate').on('click', function() {
        renderRevenueChart();
    });
}

function renderRevenueChart() {
    const $canvas = $('#revenueChart');
    if (!$canvas.length) return;

    const ctx = $canvas[0].getContext('2d');
    
    // Lấy giá trị từ input date
    const dateFrom = $('#dateFrom').val(); // YYYY-MM-DD
    const dateTo = $('#dateTo').val();

    // Logic xử lý nhãn (Labels) Ngày/Tháng/Năm
    // Ở bản demo, mình sẽ tạo ra các mốc ngày dựa trên khoảng chọn
    let labels = [];
    if (dateFrom && dateTo) {
        // Hàm chuyển YYYY-MM-DD sang DD/MM/YYYY
        const formatDate = (dateStr) => {
            const [y, m, d] = dateStr.split('-');
            return `${d}/${m}/${y}`;
        };
        
        // Demo: Hiển thị mốc bắt đầu, mốc giữa và mốc kết thúc
        labels = [formatDate(dateFrom), '15/04/2026', formatDate(dateTo)];
    } else {
        labels = ['01/04/2026', '15/04/2026', '30/04/2026'];
    }

    const revenueData = [45, 80, 120]; // Mock data
    const profitData = [15, 25, 40];

    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (triệu)',
                data: revenueData,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Lợi nhuận (triệu)',
                data: profitData,
                borderColor: '#0d6efd',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', align: 'end' } },
            scales: {
                x: {
                    ticks: { maxRotation: 0 } // Vì khoảng ngày linh hoạt nên để nằm ngang cho đẹp
                },
                y: { beginAtZero: true, ticks: { callback: v => v + 'M' } }
            }
        }
    });
}

function renderCategoryChart() {
    const $canvas = $('#categoryChart');
    if (!$canvas.length) return;
    const ctx = $canvas[0].getContext('2d');

    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Điện thoại', 'Laptop', 'Phụ kiện', 'Tablet'],
            datasets: [{
                data: [60, 20, 15, 5],
                backgroundColor: ['#dc3545', '#212529', '#0d6efd', '#ffc107'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}