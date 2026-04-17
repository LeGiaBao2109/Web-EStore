# 📁 Cấu trúc thư mục dự án Web-EStore

## 🔹 Root

* **index.js**: Entry point của server (khởi động Express, kết nối DB, load routes)
* **package.json**: Quản lý dependencies & scripts
* **HD.md**: Tài liệu hướng dẫn cho team

---

## 🔹 src/

### 📂 api/

* Tầng trung gian để **gọi API**
* Dùng để tách riêng phần request (fetch/axios) khỏi UI hoặc controller

👉 Ví dụ:

* Gọi API từ client (JS frontend)
* Hoặc gọi service ngoài (payment, shipping, AI,...)

👉 Giúp:

* Code sạch hơn
* Dễ thay đổi API sau này

---

### 📂 config/

* Cấu hình hệ thống
* Ví dụ:

  * Kết nối MongoDB
  * Biến môi trường (.env)
  * Config chung (port, secret key)

---

### 📂 controllers/

* Nhận request từ client
* Xử lý input (req)
* Gọi `service`
* Trả response (res)

👉 Không viết logic nặng ở đây

---

### 📂 services/

* Xử lý logic nghiệp vụ chính
* Là nơi:

  * Tính toán
  * Xử lý dữ liệu
  * Gọi model (DB)

👉 Đây là "bộ não" của hệ thống

---

### 📂 models/

* Định nghĩa schema MongoDB (Mongoose)
* Ví dụ:

  * Product
  * User
  * Order

👉 Tương đương database layer

---

### 📂 middlewares/

* Chạy giữa request → response
* Ví dụ:

  * Auth (check login)
  * Validation
  * Upload file
  * Error handler

---

### 📂 routes/

* Định nghĩa API endpoint
* Mapping URL → controller

👉 Ví dụ:

```js
router.get('/products', productController.getAll);
```

---

### 📂 public/

#### 📂 assets/

* File tĩnh:

  * CSS
  * JS
  * Images
  * Vendor (Bootstrap, jQuery)

#### 📂 views/

* Giao diện HTML (frontend)
* Ví dụ:

  * index.html
  * layout.html

---

### 📂 utils/

* Hàm tiện ích dùng chung
* Ví dụ:

  * Format tiền
  * Xử lý ngày
  * Helper function

---

# 🎯 Luồng hoạt động

Client → Route → Controller → Service → Model → DB

(Client-side JS có thể gọi thêm qua `api/`)

---

# 🎯 Quy tắc code

* Controller: nhẹ, chỉ điều hướng
* Service: xử lý chính
* Model: chỉ làm việc với DB
* API: chỉ gọi request (không xử lý logic)
* Không viết logic business trong route

---

# 🚀 Ghi nhớ nhanh

| Layer       | Vai trò          |
| ----------- | ---------------- |
| routes      | định tuyến       |
| controllers | nhận/trả request |
| services    | xử lý logic      |
| models      | database         |
| api         | gọi API          |
| middlewares | kiểm tra         |
| utils       | helper           |
| public      | frontend         |

---
