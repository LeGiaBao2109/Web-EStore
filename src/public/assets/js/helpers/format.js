export const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price).replace(/\s₫/, 'đ');
};