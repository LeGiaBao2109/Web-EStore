export function initNavbar() {
    const $menuToggle = $('#menuToggle');
    const $headerBottom = $('.header-bottom');
    if ($menuToggle.length && $headerBottom.length) {
        $menuToggle.on('click', function (e) {
            e.stopPropagation();
            $headerBottom.stop().slideToggle(300); 
        });
        $(document).on('click', function (e) {
            if (!$headerBottom.is(e.target) && $headerBottom.has(e.target).length === 0 && !$menuToggle.is(e.target) && $menuToggle.has(e.target).length === 0) {
                if ($headerBottom.is(':visible') && window.innerWidth <= 991) {
                    $headerBottom.stop().slideUp(300);
                }
            }
        });
        $(window).on('resize', function() {
            if (window.innerWidth > 991) {
                $headerBottom.css('display', '');
            }
        });
    }
}