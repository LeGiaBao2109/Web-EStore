export const initProductList = () => {
    const $loadMoreBtn = $('#loadMoreBtn');
    const $productContainer = $('#product-container');

    if ($loadMoreBtn.length && $productContainer.length) {
        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            const windowWidth = $(window).width();
            let itemsPerRow = 2;

            if (windowWidth >= 992) {
                itemsPerRow = 4;
            } else if (windowWidth >= 768) {
                itemsPerRow = 3;
            }

            const itemsToShow = itemsPerRow * 2;
            const $hiddenItems = $('.product-item.d-none');

            if ($hiddenItems.length > 0) {
                $hiddenItems.slice(0, itemsToShow)
                    .removeClass('d-none')
                    .hide()
                    .fadeIn(600);
            }

            // setTimeout(() => {
            //     if ($('.product-item.d-none').length === 0) {
            //         $loadMoreBtn.fadeOut(300);
            //     }
            // }, 100);
        });
    }
};