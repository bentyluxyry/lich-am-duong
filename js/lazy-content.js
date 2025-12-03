// js/lazy-content.js - PHIÊN BẢN SIÊU ĐƠN GIẢN NHẤT 2025
// Hỗ trợ TẤT CẢ định dạng: .jpg .jpeg .png .webp .avif .gif
// Chỉ up 1 file → chạy ngon lành, lazy loading 100%

document.addEventListener("DOMContentLoaded", function () {
    // Tìm tất cả thẻ img có data-src (không phân biệt đuôi)
    const lazyImages = document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Tự động lấy đúng đuôi file từ data-src
                img.src = img.dataset.src;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "200px" });

    lazyImages.forEach(img => observer.observe(img));
});
