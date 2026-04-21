export const initLogin = () => {
    $('#adminLoginForm').on('submit', function (e) {
        e.preventDefault();
        const data = {
            adminCode: $('#adminCode').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/api/admin/auth/login',
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.success) {
                    window.location.href = '/admin';
                }
            },
            error: function (xhr) {
                alert(xhr.responseJSON ?.message || "Lỗi đăng nhập");
            }
        });
    });
};

export const checkAuth = (callback) => {
    $.ajax({
        url: '/api/admin/auth/me',
        type: 'GET',
        success: function (res) {
            if (res.success) {
                if ($('#adminDisplayName').length) {
                    $('#adminDisplayName').text(res.admin.name);
                }
                if (callback) callback();
            }
        },
        error: function (xhr) {
            if (xhr.status === 401) {
                window.location.href = '/admin/login';
            }
        }
    });
};

export const initLogout = () => {
    $("#btnLogout").on('click', function (e) {
        e.preventDefault();
        
        $.ajax({
            url: '/api/admin/auth/logout',
            type: 'POST',
            success: function (res) {
                if (res.success) {
                    window.location.href = '/admin/login';
                }
            },
            error: function (xhr) {
                alert("Lỗi khi đăng xuất!");
            }
        });
    });
};