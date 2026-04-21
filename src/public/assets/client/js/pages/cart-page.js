import {
    formatPrice
} from '../../../js/helpers/format.js';

export async function initCartPage() {
    if (!$('.cart').length) return;

    loadCart();

    $(document).on('click', '.btn-plus', function () {
        const input = $(this).siblings('.cart-qty');
        let val = parseInt(input.val()) + 1;
        updateQuantity($(this).closest('.cart-item').data('id'), val);
    });

    $(document).on('click', '.btn-minus', function () {
        const input = $(this).siblings('.cart-qty');
        let val = parseInt(input.val()) - 1;
        if (val >= 1) updateQuantity($(this).closest('.cart-item').data('id'), val);
    });

    $(document).on('click', '#btn-go-to-checkout', function (e) {
        e.preventDefault();
        localStorage.setItem('checkout_type', 'cart');
        localStorage.removeItem('buy_now_id');
        window.location.href = '/cart/payment';
    });

    $(document).on('click', '.btn-remove', function () {
        const productId = $(this).closest('.cart-item').data('id');

        if (confirm("Xác nhận xóa sản phẩm này khỏi giỏ hàng?")) {
            $.ajax({
                url: '/api/cart/remove',
                type: 'DELETE',
                data: {
                    productId
                },
                success: function (res) {
                    if (res.success) {
                        loadCart();
                    } else {
                        alert(res.message || "Không thể xóa sản phẩm");
                    }
                }
            });
        }
    });
}

async function loadCart() {
    $.ajax({
        url: '/api/cart/get-cart',
        type: 'GET',
        success: function (res) {
            if (res.success && res.data) {
                renderCartItems(res.data);
            }
        }
    });
}

function updateQuantity(productId, quantity) {
    $.ajax({
        url: '/api/cart/update-quantity',
        type: 'POST',
        data: {
            productId,
            quantity
        },
        success: function (res) {
            if (res.success) {
                loadCart();
            }
        }
    });
}

function renderCartItems(cart) {
    const tbody = $('table tbody');
    tbody.empty();

    cart.items.forEach(item => {
        const product = item.productId;
        const totalItemPrice = item.price * item.quantity;

        const html = `
            <tr class="cart-item" data-id="${product._id}">
                <td class="py-4 px-4">
                    <div class="d-flex align-items-center">
                        <div class="rounded-3 border p-1 bg-white shadow-sm flex-shrink-0" style="width: 90px; height: 90px;">
                            <img src="${product.image.url}" class="w-100 h-100 object-fit-contain">
                        </div>
                        <div class="ms-3 flex-grow-1">
                            <h6 class="fw-bold mb-1">${product.name}</h6>
                            <p class="text-muted small mb-0">SKU: ${item.sku}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-center">
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="input-group input-group-sm border rounded-pill overflow-hidden" style="width: 110px;">
                            <button class="btn btn-light border-0 btn-minus"><i class="bi bi-dash"></i></button>
                            <input type="text" class="form-control border-0 text-center fw-bold bg-transparent p-0 cart-qty" value="${item.quantity}" readonly>
                            <button class="btn btn-light border-0 btn-plus"><i class="bi bi-plus"></i></button>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-center d-none d-lg-table-cell">${formatPrice(item.price)}</td>
                <td class="py-4 text-center d-none d-lg-table-cell fw-bold text-danger">${formatPrice(totalItemPrice)}</td>
                <td class="py-4 text-center d-none d-lg-table-cell">
                    <button class="btn btn-outline-danger btn-sm border-0 btn-remove"><i class="bi bi-x-lg"></i></button>
                </td>
            </tr>
        `;
        tbody.append(html);
    });

    $('.h3.text-danger').text(formatPrice(cart.totalAmount));
}