// js/lazy-content.js - LAZY LOADING CHO TẤT CẢ BÀI VIẾT CHI TIẾT (CHỈ 1 FILE DUY NHẤT)
document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img[data-src]");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "150px" });

    lazyImages.forEach(img => observer.observe(img));
});
