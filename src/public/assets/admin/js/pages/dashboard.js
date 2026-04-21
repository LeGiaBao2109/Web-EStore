let revenueChart;

export function initDashboardCharts() {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    if (!$('#globalDateFrom').val()) $('#globalDateFrom').val(firstDayOfMonth);
    $('#globalDateTo').val(today);

    fetchDashboardData();

    $('#btnGlobalFilter').on('click', function () {
        fetchDashboardData();
    });
}

async function fetchDashboardData() {
    const from = $('#globalDateFrom').val();
    const to = $('#globalDateTo').val();

    $.ajax({
        url: `/api/admin/dashboard/stats?from=${from}&to=${to}`,
        type: 'GET',
        success: function (res) {
            if (res.success) {
                $('#stat-revenue').text(res.cards.revenue + 'M');
                $('#stat-stock').text(res.cards.stock);
                $('#stat-orders').text(res.cards.newOrders);

                $('#chartRangeLabel').text(`Từ ${from} đến ${to}`);

                renderRevenueChart(res.chart);
            }
        }
    });
}

function renderRevenueChart(chartData) {
    const $canvas = $('#revenueChart');
    if (!$canvas.length) return;

    const ctx = $canvas[0].getContext('2d');

    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Doanh thu (triệu)',
                data: chartData.revenue,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#dc3545',
                spanGaps: true,
                showLine: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 15
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v => v + 'M'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}