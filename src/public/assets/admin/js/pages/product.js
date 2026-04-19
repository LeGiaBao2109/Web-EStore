export function initProducts() {
    window.switchSubTab = function (target) {
        let tabTriggerEl = document.querySelector(`button[data-bs-target="#subtab-${target}"]`);
        if (tabTriggerEl) {
            new bootstrap.Tab(tabTriggerEl).show();
        }
    };

    window.viewProductDetail = function (productId) {
        let firstTabEl = document.querySelector('button[data-bs-target="#subtab-info"]');
        if (firstTabEl) {
            new bootstrap.Tab(firstTabEl).show();
        }
    };

    window.updatePrice = function () {
        const newPrice = $('#newPrice').val();
        const reason = $('#priceReason').val();
        if (!newPrice) {
            alert("Vui lòng nhập giá mới!");
            return;
        }
        const now = new Date().toLocaleDateString('vi-VN');
        const newRow = `
            <tr>
                <td class="small">${now}</td>
                <td class="fw-bold text-danger">${Number(newPrice).toLocaleString()}đ</td>
                <td>${reason || 'Cập nhật định kỳ'}</td><td class="small">Lê Gia Bảo</td>
                <td class="text-center text-success">
                    <i class="bi bi-check-circle-fill"></i>
                </td>
            </tr>`;
        $('#priceHistoryBody i.bi-check-circle-fill').remove();
        $('#priceHistoryBody').prepend(newRow);
        $('#newPrice').val('');
        $('#priceReason').val('');
        alert("Cập nhật giá thành công!");
    };

    window.updateWarehouse = function () {
        const type = $('#logType').val();
        const qty = $('#logQty').val();
        const note = $('#logNote').val();
        if (!qty || qty <= 0) {
            alert("Số lượng phải lớn hơn 0!");
            return;
        }
        const now = new Date().toLocaleDateString('vi-VN');
        const badgeClass = type === 'import' ? 'bg-success' : 'bg-danger';
        const typeText = type === 'import' ? 'Nhập kho' : 'Xuất kho';
        const qtyClass = type === 'import' ? 'text-success' : 'text-danger';
        const newLogRow = `
            <tr>
                <td class="small">${now}</td
                <td>
                    <span class="badge ${badgeClass}">${typeText}</span>
                </td>
                <td class="fw-bold ${qtyClass}">${type === 'import' ? '+' : '-'}${qty}</td>
                <td>${note || 'Giao dịch kho'}</td
                <td class="small">Lê Gia Bảo</td
            ></tr>`;
        $('#warehouseHistoryBody').prepend(newLogRow);
        $('#logQty').val('');
        $('#logNote').val('');
        alert("Ghi sổ kho thành công!");
    };
}