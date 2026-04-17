export function initAuth() {
    $(document).on('click', '.toggle-password', function() {
        const $input = $(this).closest('.input-group').find('.password-input');
        const $icon = $(this).find('i');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.attr('class', 'bi bi-eye text-danger');
        } else {
            $input.attr('type', 'password');
            $icon.attr('class', 'bi bi-eye-slash text-secondary');
        }
    });

    $('#switchToRegister').on('click', function(e) {
        e.preventDefault();
        $('#register-tab').tab('show');
    });

    $('#switchToLogin').on('click', function(e) {
        e.preventDefault();
        $('#login-tab').tab('show');
    });
}