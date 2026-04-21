$(document).ready(function() {
    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        const keyword = $('#search-input').val().trim();
        
        if (keyword) {
            window.location.href = `/products/search?keyword=${keyword}`;
        }
    });
});