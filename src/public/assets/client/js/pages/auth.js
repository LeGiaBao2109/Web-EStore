export function initAuth() {
    $(document).on('click', '.toggle-password', function () {
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

    $('#switchToRegister').on('click', function (e) {
        e.preventDefault();
        $('#register-tab').tab('show');
    });

    $('#switchToLogin').on('click', function (e) {
        e.preventDefault();
        $('#login-tab').tab('show');
    });

    $('#formRegister').on('submit', function (e) {
        e.preventDefault();
        const fullName = $('#registerName').val()?.trim();
        const email = $('#registerEmail').val()?.trim();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fullName && fullName.length < 2) {
            alert("Họ tên phải ít nhất 2 ký tự!");
            return;
        }
        if (email && !emailRegex.test(email)) {
            alert("Email không đúng định dạng!");
            return;
        }
        if (password && password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const data = $(this).serialize();
        $.ajax({
            url: '/api/auth/register',
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.success) {
                    alert("Đăng ký thành công!");
                    $('#login-tab').tab('show');
                    $('#formRegister')[0].reset();
                } else {
                    alert(res.message);
                }
            }
        });
    });

    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        const account = $('#loginAccount').val()?.trim();
        const password = $(this).find('.password-input').val();

        if (!account || !password) {
            alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
            return;
        }

        $.ajax({
            url: '/api/auth/login',
            type: 'POST',
            data: {
                account: account,
                password: password
            },
            success: function (res) {
                if (res.success) {
                    window.location.href = '/';
                } else {
                    alert(res.message);
                }
            },
            error: function (xhr) {
                alert("Lỗi kết nối server!");
            }
        });
    });

    $('#btnForgotPassword').on('click', function (e) {
        e.preventDefault();
        const email = prompt("Nhập email của bạn để nhận mã OTP:");
        if (email) {
            $.ajax({
                url: '/api/auth/password/forgot',
                type: 'POST',
                data: { email: email.trim() },
                success: function (res) {
                    if (res.success) {
                        alert(res.message);
                        const otp = prompt("Nhập mã OTP 6 số:");
                        if (otp) {
                            $.ajax({
                                url: '/api/auth/password/otp',
                                type: 'POST',
                                data: { email: email.trim(), otp: otp },
                                success: function (resOtp) {
                                    if (resOtp.success) {
                                        const newPass = prompt("Nhập mật khẩu mới:");
                                        if (newPass) {
                                            $.ajax({
                                                url: '/api/auth/password/reset',
                                                type: 'POST',
                                                data: { email: email.trim(), password: newPass },
                                                success: function (r) { alert(r.message); }
                                            });
                                        }
                                    } else { alert(resOtp.message); }
                                }
                            });
                        }
                    } else { alert(res.message); }
                }
            });
        }
    });
}