export function initProducts() {
    let currentAdminName = "Admin";
    const categoryBrands = {
        "dien-thoai": ["Apple", "Samsung", "Xiaomi", "Vivo", "Oppo", "Realme", "Nokia"],
        "tablet": ["Apple", "Samsung", "Xiaomi"],
        "laptop": ["Apple", "Asus", "Dell", "HP", "MSI"],
        "man-hinh": ["Samsung", "LG", "Asus", "Dell"],
        "phu-kien": ["Apple", "Sony", "JBL", "Logitech"],
        "gia-dung": ["Panasonic", "Sunhouse", "Philips"]
    };

    const fetchAdminInfo = () => {
        $.ajax({
            url: '/api/admin/auth/me',
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    currentAdminName = res.admin.name;
                    if ($('#adminDisplayName').length) {
                        $('#adminDisplayName').text(res.admin.name);
                    }
                }
            }
        });
    };

    const loadProducts = () => {
        $.ajax({
            url: '/api/admin/products',
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    let html = '';
                    res.products.forEach(item => {
                        html += `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.image?.url || 'https://via.placeholder.com/45'}"
                                        class="rounded-3 me-3"
                                        style="width: 45px; height: 45px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-0 fw-bold">${item.name}</h6>
                                        <small class="text-muted">ID: ${item._id.slice(-6).toUpperCase()}</small>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">${item.brand || 'N/A'}</td>
                            <td class="text-center fw-bold text-danger">
                                ${item.priceId ? Number(item.priceId.price).toLocaleString() : 0}đ
                            </td>
                            <td class="text-center">
                                <span class="badge bg-light text-dark border">${item.stock} chiếc</span>
                            </td>
                            <td class="text-center">
                                <span class="badge ${item.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
                                    ${item.status}
                                </span>
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-light border-0"
                                    onclick="viewProductDetail('${item._id}')" data-bs-toggle="modal"
                                    data-bs-target="#modalProductDetail">
                                    <i class="bi bi-pencil-square"></i> Sửa/Chi tiết
                                </button>
                            </td>
                        </tr>`;
                    });
                    $('#productTableBody').html(html);
                }
            }
        });
    };

    const updateBrandOptions = (category, selectId, selectedBrand = "") => {
        let brands = [...(categoryBrands[category] || [])];
        
        if (selectedBrand && !brands.includes(selectedBrand)) {
            brands.push(selectedBrand);
        }

        let html = brands.map(b => `<option value="${b}" ${b === selectedBrand ? 'selected' : ''}>${b}</option>`).join('');
        const $select = $(`#${selectId}`);
        $select.html(html);
        
        if ($select.data('select2')) {
            $select.trigger('change');
        }
    };

    fetchAdminInfo();
    loadProducts();

    $('#editProductCategory').on('change', function () {
        updateBrandOptions($(this).val(), 'editProductBrand');
    });

    $('#addCategory').on('change', function () {
        updateBrandOptions($(this).val(), 'addBrand');
    });

    $('#editProductImage').on('input', function() {
        $('#editProductPreview').attr('src', $(this).val() || 'https://via.placeholder.com/150');
    });

    $('#btnSaveNewProduct').on('click', function () {
        const data = {
            name: $('#addProductName').val(),
            image: { url: $('#addImageUrl').val() },
            initialPrice: $('#addInitialPrice').val(),
            stock: $('#addStock').val(),
            brand: $('#addBrand').val(),
            category: $('#addCategory').val(),
            description: $('#addDescription').val()
        };

        if (!data.name || !data.initialPrice) {
            alert("Vui lòng nhập tên và giá sản phẩm!");
            return;
        }

        $.ajax({
            url: '/api/admin/products/create',
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("Thêm sản phẩm thành công!");
                    $('#modalProduct').modal('hide');
                    $('#modalProduct input, #modalProduct textarea').val('');
                    loadProducts();
                }
            },
            error: function (xhr) {
                alert(xhr.responseJSON?.message || "Lỗi khi thêm sản phẩm");
            }
        });
    });

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

        $.ajax({
            url: `/api/admin/products/${productId}`,
            type: 'GET',
            success: function (res) {
                if (res.success) {
                    const p = res.product;
                    $('#modalProductDetail').attr('data-id', p._id);
                    $('#detailProductName').text(p.name);
                    $('#editProductName').val(p.name);
                    $('#editProductImage').val(p.image?.url || '');
                    $('#editProductPreview').attr('src', p.image?.url || 'https://via.placeholder.com/150');
                    
                    $('#editProductCategory').val(p.category);
                    
                    updateBrandOptions(p.category, 'editProductBrand', p.brand);

                    $('#editProductStatus').val(p.status);
                    $('#editProductDesc').val(p.description);
                    $('#currentPriceDisplay').text(Number(p.priceId?.price || 0).toLocaleString() + 'đ');
                    $('#currentStockDisplay').html(`${p.stock} <small class="fw-normal">chiếc</small>`);
                    
                    loadExtraData(p._id);
                }
            }
        });
    };

    const loadExtraData = (productId) => {
        $.get(`/api/admin/products/price-history/${productId}`, function(resPrice) {
            if(resPrice.success) {
                let html = resPrice.history.map(item => {
                    const dateObj = new Date(item.createdAt);
                    return `
                    <tr>
                        <td class="small">${isNaN(dateObj) ? 'N/A' : dateObj.toLocaleDateString('vi-VN')}</td>
                        <td class="fw-bold text-danger">${Number(item.price).toLocaleString()}đ</td>
                        <td>${item.reason || 'N/A'}</td>
                        <td class="small">Admin</td>
                        <td class="text-center">
                            ${item.isCurrent ? '<i class="bi bi-check-circle-fill text-success"></i>' : ''}
                        </td>
                    </tr>`;
                }).join('');
                $('#priceHistoryBody').html(html || '<tr><td colspan="5" class="text-center">Trống</td></tr>');
            }
        });

        $.get(`/api/admin/products/warehouse-logs/${productId}`, function(resLog) {
            if(resLog.success) {
                let html = resLog.logs.length > 0 ? resLog.logs.map(item => {
                    const dateObj = new Date(item.createdAt);
                    return `
                    <tr>
                        <td class="small">${dateObj.toLocaleDateString('vi-VN')}</td>
                        <td><span class="badge ${item.type === 'import' ? 'bg-success' : 'bg-danger'}">${item.type === 'import' ? 'Nhập kho' : 'Xuất kho'}</span></td>
                        <td class="fw-bold ${item.type === 'import' ? 'text-success' : 'text-danger'}">${item.type === 'import' ? '+' : '-'}${item.quantity}</td>
                        <td>${item.note || 'Không có ghi chú'}</td>
                        <td class="small">Admin</td>
                    </tr>`;
                }).join('') : '<tr><td colspan="5" class="text-center">Chưa có nhật ký nhập xuất</td></tr>';
                $('#warehouseHistoryBody').html(html);
            }
        });
    }

    window.updateProductGeneralInfo = function () {
        const productId = $('#modalProductDetail').attr('data-id');
        if (!productId) return alert("Không tìm thấy ID sản phẩm!");

        const data = {
            name: $('#editProductName').val(),
            "image.url": $('#editProductImage').val(),
            category: $('#editProductCategory').val(),
            brand: $('#editProductBrand').val(),
            status: $('#editProductStatus').val(),
            description: $('#editProductDesc').val()
        };

        const $btn = $('#btnUpdateProductInfo');
        const originalText = $btn.html();
        $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Đang lưu...');

        $.ajax({
            url: `/api/admin/products/update/${productId}`,
            type: 'PUT',
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("Cập nhật thông tin thành công!");
                    $('#detailProductName').text(data.name);
                    loadProducts();
                }
            },
            error: function (xhr) {
                alert(xhr.responseJSON?.message || "Lỗi khi cập nhật sản phẩm");
            },
            complete: function () {
                $btn.prop('disabled', false).html(originalText);
            }
        });
    };

    window.updatePrice = function () {
        const productId = $('#modalProductDetail').attr('data-id');
        const newPrice = $('#newPrice').val();
        const reason = $('#priceReason').val();
        if (!newPrice) return alert("Vui lòng nhập giá mới!");

        $.ajax({
            url: `/api/admin/products/update-price/${productId}`,
            type: 'POST',
            data: { price: newPrice, reason: reason },
            success: function (res) {
                if (res.success) {
                    alert("Cập nhật giá thành công!");
                    $('#currentPriceDisplay').text(Number(newPrice).toLocaleString() + 'đ');
                    $('#newPrice, #priceReason').val('');
                    viewProductDetail(productId);
                    loadProducts();
                }
            }
        });
    };

    window.updateWarehouse = function () {
        const productId = $('#modalProductDetail').attr('data-id');
        const type = $('#logType').val();
        const qty = $('#logQty').val();
        const note = $('#logNote').val();
        if (!qty || qty <= 0) return alert("Số lượng phải lớn hơn 0!");

        $.ajax({
            url: `/api/admin/products/update-stock/${productId}`,
            type: 'POST',
            data: { type: type, quantity: qty, note: note },
            success: function (res) {
                if (res.success) {
                    alert("Ghi sổ kho thành công!");
                    $('#currentStockDisplay').html(`${res.product.stock} <small class="fw-normal">chiếc</small>`);
                    $('#logQty, #logNote').val('');
                    viewProductDetail(productId);
                    loadProducts();
                }
            }
        });
    };
}