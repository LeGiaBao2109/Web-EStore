/**
 * Khởi tạo logic cho trang Thông tin cá nhân (Phase 7)
 */
export const initUserProfile = () => {
    console.log("User Profile System: Active");

    // 1. Giả lập dữ liệu từ USERS Schema
    const currentUser = {
        name: "Lê Gia Bảo",
        username: "giabao_dev",
        email: "legiabao@iuh.edu.vn",
        phone: "0358356268",
        address: "12 đường Mẹ Thiên Tích, P.11, Q.5, TP.HCM"
    };

    // 2. Render dữ liệu người dùng lên UI
    renderUserData(currentUser);

    // 3. Gắn sự kiện Đăng xuất
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }

    // 4. Gắn sự kiện Lưu cập nhật thông tin (Dùng cho Modal)
    const btnSaveInfo = document.querySelector('#modalUpdate .btn-danger');
    if (btnSaveInfo) {
        btnSaveInfo.addEventListener('click', () => {
            alert("Thông tin đã được cập nhật thành công!");
            // Logic call API update MongoDB ở đây
        });
    }
};

/**
 * Hiển thị dữ liệu lên các thẻ HTML tương ứng
 */
const renderUserData = (user) => {
    const fields = {
        'display-name': user.name,
        'u-username': user.username,
        'u-email': user.email,
        'u-phone': user.phone,
        'u-address': user.address
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }
};

/**
 * Xử lý đăng xuất
 */
const handleLogout = (e) => {
    e.preventDefault();
    if (confirm("Bảo có chắc muốn đăng xuất không?")) {
        // Xóa session/localStorage nếu có
        console.log("Clearing session...");
        window.location.href = "/login.html";
    }
};