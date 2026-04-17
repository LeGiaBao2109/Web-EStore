export function initProductSlider(sliderId) {
    const $slider = $(`#${sliderId}`);
    if (!$slider.length) return null;

    return {
        slide: (direction) => {
            const scrollAmount = $slider.width() / 2;
            const currentScroll = $slider.scrollLeft();
            const maxScrollLeft = $slider[0].scrollWidth - $slider.width();
            
            let newScrollLeft = currentScroll + (direction * scrollAmount);

            if (newScrollLeft >= maxScrollLeft + 10) {
                $slider.animate({ scrollLeft: 0 }, 600);
            } else if (newScrollLeft <= -10) {
                $slider.animate({ scrollLeft: maxScrollLeft }, 600);
            } else {
                $slider.animate({ scrollLeft: newScrollLeft }, 400);
            }
        }
    };
}