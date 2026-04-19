// /assets/admin/js/dashboard.js
let revenueChart, categoryChart;

export function initDashboardCharts() {
    renderRevenueChart();
    renderCategoryChart();

    $('#btnFilterDate').on('click', function () {
        renderRevenueChart();
    });
}

function renderRevenueChart() {
    const $canvas = $('#revenueChart');
    if (!$canvas.length) return;

    const ctx = $canvas[0].getContext('2d');

    const dateFrom = $('#dateFrom').val();
    const dateTo = $('#dateTo').val();

    let labels = [];
    if (dateFrom && dateTo) {
        const formatDate = (dateStr) => {
            const [y, m, d] = dateStr.split('-');
            return `${d}/${m}/${y}`;
        };

        labels = [formatDate(dateFrom), '15/04/2026', formatDate(dateTo)];
    } else {
        labels = ['01/04/2026', '15/04/2026', '30/04/2026'];
    }

    const revenueData = [45, 80, 120];
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
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v => v + 'M'
                    }
                }
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
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}