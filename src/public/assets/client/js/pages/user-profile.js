export const initUserProfile = () => {
    const currentUser = {
        name: "Lê Gia Bảo",
        username: "giabao_dev",
        email: "legiabao@iuh.edu.vn",
        phone: "0358356268",
        address: "12 đường Mẹ Thiên Tích, P.11, Q.5, TP.HCM"
    };

    $('#display-name').text(currentUser.name);
    $('#u-username').text(currentUser.username);
    $('#u-email').text(currentUser.email);
    $('#u-phone').text(currentUser.phone);
    $('#u-address').text(currentUser.address);

    $('#btnLogout').on('click', function(e) {
        e.preventDefault();
        if (confirm("Bảo có chắc muốn đăng xuất không?")) {
            window.location.href = "/";
        }
    });

    $('#modalUpdate .btn-danger').on('click', function() {
        const updatedData = {
            name: $('#editName').val(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val(),
            address: $('#editAddress').val()
        };

        console.log("Dữ liệu cập nhật:", updatedData);
        alert("Thông tin cá nhân đã được lưu!");
        
        $('#modalUpdate').modal('hide');
    });
};