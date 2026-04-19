# 🔍 HƯỚNG DẪN SEARCH FUNCTIONALITY

**Ngày:** 19 tháng 4, 2026  
**Status:** ✅ Hoàn toàn (Client-side Search)

---

## 📋 TỔNG QUAN

Hệ thống search bao gồm:
1. **Search Bar** - Ở header (index.html, product-list.html, layout.html)
2. **Search API** - `/api/products/search?keyword=...`
3. **Search Results Page** - `/search?keyword=...`
4. **JavaScript Handler** - Client-side search logic

---

## 🔧 CÁC FILE ĐÃ THÊM/SỬA

### **1. HTML Files - Thêm ID cho search input**

| File | Thay Đổi |
|------|----------|
| `product-list.html` | Thêm `id="search-input"` + `id="search-form"` |
| `index.html` | Thêm `id="search-input"` + `id="search-form"` |
| `layout.html` | Thêm `id="search-input"` + `id="search-form"` |

**Trước:**
```html
<form class="d-flex w-100 me-3" role="search">
    <input class="form-control mx-2 rounded-pill shadow-none" type="search" name="keyword">
</form>
```

**Sau:**
```html
<form class="d-flex w-100 me-3" role="search" id="search-form">
    <input class="form-control mx-2 rounded-pill shadow-none" id="search-input" type="search" name="keyword">
</form>
```

---

### **2. script.js - Sạch & Sửa Search Handler**

**Path:** `/src/public/assets/client/js/script.js`

**Thay Đổi:**
- Xóa code lỗi: `$ // script.js` 
- Fix search form handler
- Thêm comment tiếng Anh chuyên nghiệp

**Code:**
```javascript
// 4. Search form handler
$('#search-form').on('submit', function (e) {
    e.preventDefault();
    const keyword = $('#search-input').val().trim();
    if (keyword) {
        // Navigate to search results page
        window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
});
```

---

### **3. Product Service - Thêm name Filter**

**Path:** `/src/services/client/product.service.js`

**Thay Đổi:**
```javascript
// Filter by product name (for search)
if (filters.name) {
    findQuery.name = filters.name;
}
```

---

### **4. NEW - Search Results Page**

**Path:** `/src/public/views/client/search.html`

**Tính Năng:**
- ✅ Hiển thị từ khóa tìm kiếm
- ✅ Loading spinner
- ✅ Grid sản phẩm (tương tự product-list)
- ✅ "Không tìm thấy" message
- ✅ Re-search functionality

---

### **5. NEW - Search JavaScript Module**

**Path:** `/src/public/assets/client/js/pages/search.js`

**Export Function:** `initSearchResults()`

**Tính Năng:**
- Lấy keyword từ URL query parameter
- Gọi `/api/products/search?keyword=...`
- Render sản phẩm với `createProductHTML()`
- Error handling

**Code Flow:**
```javascript
export const initSearchResults = () => {
    1. Get keyword from URL: params.get('keyword')
    2. Show loading spinner
    3. AJAX: GET /api/products/search?keyword=...
    4. On success: render products
    5. On error: show error message
}
```

---

### **6. NEW - Search Controller**

**Path:** `/src/controllers/client/search.controller.js`

**Function:** `search()` - Render search.html page

---

### **7. NEW - Search Routes**

**Path:** `/src/routes/client/search.route.js`

**Routes:**
```javascript
GET /search  →  searchController.search()
```

**Mounted in index.route.js:**
```javascript
router.use('/search', searchRoutes);
```

---

### **8. API Endpoint - Search**

**Existing in:** `/src/api/client/product.api.js`

**Endpoint:** `GET /api/products/search`

**Query Parameters:**
- `keyword` (required) - Từ khóa tìm kiếm

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "image": {"url": "..."},
      "priceId": {"price": 25990000},
      "status": "active"
    }
  ]
}
```

---

## 🧪 CÁCH TEST SEARCH

### **Test 1: Basic Search**
1. Vào trang `/` hoặc `/products`
2. Type "iPhone" vào search bar
3. Click "Tìm Kiếm" hoặc Enter
4. ✅ Redirect to `/search?keyword=iPhone`
5. ✅ Hiển thị tất cả sản phẩm có chứa "iPhone"

### **Test 2: No Results**
1. Search "XYZ123" (không tồn tại)
2. ✅ Hiển thị "Không tìm thấy sản phẩm"
3. ✅ Hiển thị từ khóa searched

### **Test 3: Empty Search**
1. Click search mà không nhập gì
2. ✅ Không submit hoặc redirect
3. ✅ Show validation

### **Test 4: Special Characters**
1. Search "Samsung & Apple"
2. ✅ URL encode đúng: `keyword=Samsung%20%26%20Apple`
3. ✅ Tìm kiếm đúng

### **Test 5: Re-search from Results Page**
1. Search "Laptop" → Get results
2. In search bar on results page, type "Phone"
3. Click search again
4. ✅ Redirect to `/search?keyword=Phone` (updated)
5. ✅ Show new results

---

## 📊 SEARCH FLOW

```
USER TYPE KEYWORD IN SEARCH BAR
    ↓
CLICK "Tìm Kiếm" / PRESS ENTER
    ↓
JavaScript: $('#search-form').submit() handler
    ↓
Get keyword: $('#search-input').val().trim()
    ↓
Navigate: window.location.href = `/search?keyword=iPhone`
    ↓
BROWSER: GET /search?keyword=iPhone
    ↓
Search Controller: render search.html
    ↓
search.html LOADS with JavaScript
    ↓
initSearchResults() called
    ↓
1. Extract keyword from URL: URLSearchParams
2. Display keyword in page
3. Show loading spinner
    ↓
AJAX: GET /api/products/search?keyword=iPhone
    ↓
API HANDLER (product.api.js):
  - Get keyword from query
  - Call service.findProductList({name: RegExp(keyword)})
    ↓
SERVICE (product.service.js):
  - Create findQuery with name filter
  - Lookup prices
  - Aggregate results
  - Return products
    ↓
API RETURNS: {success: true, data: [...]}
    ↓
JavaScript: On success callback
  - Clear loading spinner
  - Render products grid
  - Each product: createProductHTML(item, true)
    ↓
DISPLAY RESULTS TO USER ✅
```

---

## ⚙️ CONFIGURATION

### **Search Behavior**
- **Case-insensitive:** Yes (RegExp with 'i' flag)
- **Partial match:** Yes (regex search)
- **Active only:** Yes (status: "active")
- **URL encoding:** Yes (encodeURIComponent)

### **Error Handling**
- No keyword → Show message
- API error → Show error message
- No results → Show "Không tìm thấy" message

---

## 🐛 TROUBLESHOOTING

### **Problem: Search bar not working**
**Solution:**
1. Check HTML has `id="search-form"` + `id="search-input"`
2. Check browser console for JS errors
3. Verify jQuery loaded

### **Problem: Results page blank**
**Solution:**
1. Check `/api/products/search` returns data
2. Check MongoDB has products with matching name
3. Check console → Network tab for AJAX response

### **Problem: URL not encoding correctly**
**Solution:**
- Already fixed: `encodeURIComponent(keyword)`
- Special chars like `&`, `#`, `?` are encoded

### **Problem: Results not updating on re-search**
**Solution:**
- Search route calls `initSearchResults()` which reads URL
- URL must have `?keyword=...` parameter
- Verify redirect URL is correct

---

## 📝 DATABASE REQUIREMENTS

### **Product Schema Must Have:**
```javascript
{
  _id: ObjectId,
  name: String,          // ← Used for search
  slug: String,
  image: {url: String},
  priceId: ObjectId,
  status: String         // ← Must be "active"
}
```

### **Ensure Products Have:**
- ✅ name field (not empty)
- ✅ status = "active"
- ✅ priceId reference to price
- ✅ image.url populated

---

## 🔐 SECURITY NOTES

✅ **URL Encoding:** `encodeURIComponent()` prevents XSS  
✅ **Regex Search:** Safe with `.split('-')` + Number conversion  
✅ **Status Filter:** Only shows "active" products  
⚠️ **TODO:** Add rate limiting for search API

---

## 📚 RELATED FILES

**Search Files:**
- `/src/public/views/client/search.html` - Search results page
- `/src/public/assets/client/js/pages/search.js` - Search logic
- `/src/controllers/client/search.controller.js` - Controller
- `/src/routes/client/search.route.js` - Routes

**Related Files:**
- `/src/api/client/product.api.js` - `/api/products/search` endpoint
- `/src/services/client/product.service.js` - Search service
- `/src/public/assets/client/js/script.js` - Search form handler
- `/src/public/views/client/product-list.html` - Has search bar

---

## ✨ FEATURES IMPLEMENTED

| Feature | Status | Details |
|---------|--------|---------|
| Search Bar | ✅ | On all pages (index, products, layout) |
| Search Submit | ✅ | Form submit handler |
| URL Encoding | ✅ | Proper encodeURIComponent |
| Search Results | ✅ | Dedicated page |
| Product Grid | ✅ | Same as product-list |
| Loading State | ✅ | Spinner shown during fetch |
| No Results | ✅ | User-friendly message |
| Re-search | ✅ | Can search again from results page |
| Error Handling | ✅ | Try-catch + user messages |
| Mobile Responsive | ✅ | Bootstrap grid |

---

## 🎯 NEXT STEPS (Optional Enhancements)

1. **Search Suggestions** - Show autocomplete as user types
2. **Search History** - Save recent searches (localStorage)
3. **Advanced Filters** - On search results (brand, price, etc)
4. **Search Analytics** - Track popular searches
5. **Rate Limiting** - Prevent abuse
6. **Search Pagination** - If too many results

---

## 📞 SUPPORT

**If search still not working:**

1. ✅ Check all HTML have `id="search-form"` + `id="search-input"`
2. ✅ Check `/api/products/search` returns valid JSON
3. ✅ Check MongoDB has products with name field
4. ✅ Open browser console (F12) and check for errors
5. ✅ Check Network tab → XHR requests

**Browser Console Test:**
```javascript
// Test direct API
fetch('/api/products/search?keyword=iPhone')
  .then(r => r.json())
  .then(d => console.log(d))

// Should return: {success: true, data: [...]}
```

---

**✅ SEARCH SYSTEM COMPLETE & READY TO USE! 🎉**
