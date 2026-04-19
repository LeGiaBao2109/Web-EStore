export const initProductList = async () => {
    const $productSlider = $('#productSlider');

    if ($productSlider.length) {
        try {
            const response = await $.ajax({
                url: "/api/products/get-products",
                method: "GET"
            });

            if (response.success && response.data.length > 0) {
                renderProducts(response.data, $productSlider);
                
            } else {
                $productSlider.html('<p class="text-center w-100">Chưa có sản phẩm nào.</p>');
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
        }
    }
};

function renderProducts(products, container) {
    let html = '';
    products.forEach(item => {
        html += `
            <div class="product-item">
                <div class="card h-100 border-0 shadow-sm">
                    <a href="/products/${item.slug}">
                        <img src="${item.image.url}" class="card-img-top" alt="${item.name}">
                    </a>
                    <div class="card-body text-center">
                        <h6 class="fw-bold">${item.name}</h6>
                        <p class="text-danger fw-bold">25.990.000đ</p>
                        <div class="buttons d-flex gap-2">
                            <a href="/products/${item.slug}" class="btn btn-outline-danger btn-sm rounded-pill w-100 p-2">Mua Ngay</a>
                            <button class="btn btn-danger btn-sm rounded-circle p-2 text-center add-to-cart">
                                <i class="bi bi-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.html(html);
}