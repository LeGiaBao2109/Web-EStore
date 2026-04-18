export const prepareReview = (name) => {
    const modalTitle = document.getElementById('modalProductName');
    const textArea = document.getElementById('reviewText');
    
    if (modalTitle) modalTitle.innerText = name;
    if (textArea) textArea.value = '';
};

export const submitReview = () => {
    const name = document.getElementById('modalProductName')?.innerText;
    const content = document.getElementById('reviewText')?.value;

    if (!content || !content.trim()) {
        alert("Vui lòng nhập nội dung đánh giá!");
        return;
    }

    console.log(`Gửi đánh giá cho ${name}: ${content}`);
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");

    const modalElement = document.getElementById('reviewModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
};

export const initOrderHistory = () => {
    window.prepareReview = prepareReview;

    const submitBtn = document.querySelector('#reviewModal .btn-danger');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitReview);
    }
};