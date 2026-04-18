export const initUserProfile = () => {
    console.log("User Profile System: Active");

    const currentUser = {
        name: "Lê Gia Bảo",
        username: "giabao_dev",
        email: "legiabao@iuh.edu.vn",
        phone: "0358356268",
        address: "12 đường Mẹ Thiên Tích, P.11, Q.5, TP.HCM"
    };

    renderUserData(currentUser);

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }

    const btnSaveInfo = document.querySelector('#modalUpdate .btn-danger');
    if (btnSaveInfo) {
        btnSaveInfo.addEventListener('click', () => {
            alert("Thông tin đã được cập nhật thành công!");
        });
    }
};

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

const handleLogout = (e) => {
    e.preventDefault();
    if (confirm("Bảo có chắc muốn đăng xuất không?")) {
        console.log("Clearing session...");
        window.location.href = "/login.html";
    }
};