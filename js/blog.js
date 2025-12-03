// js/blog.js - PHIÊN BẢN HOÀN HẢO NHẤT 2025
// Đã fix: đường dẫn ảnh, ngày tháng, định dạng ngày, emoji, video badge, lazy loading...

const blogPosts = [
    {
        id: 1,
        title: "Cách Xem Lịch Âm Dương Chính Xác",
        excerpt: "Hướng dẫn chi tiết cách đọc và tra cứu lịch âm dương, hiểu về Can Chi và ngày tốt xấu trong văn hóa Việt Nam.",
        category: "lich",
        categoryName: "Lịch Âm Dương",
        date: "2025-12-01",
        views: 1250,
        image: "../img/blog/content/lich-am-duong.jpg",
        emoji: "Calendar"
    },
    {
        id: 2,
        title: "Phong Thủy Nhà Ở: Những Điều Cần Biết",
        excerpt: "Khám phá các nguyên tắc cơ bản của phong thủy nhà ở để mang lại may mắn và hạnh phúc cho gia đình.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2025-11-28",
        views: 980,
        image: "../img/blog/content/phong-thuy-nha-o.jpg",
        emoji: "House"
    },
    {
        id: 3,
        title: "Ý Nghĩa Của Tết Nguyên Đán",
        excerpt: "Tìm hiểu về nguồn gốc, ý nghĩa và các phong tục truyền thống trong dịp Tết Nguyên Đán của người Việt.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2025-11-25",
        views: 1580,
        image: "../img/blog/content/y-nghia-tet-nguyen-dan.jpg",
        emoji: "Party popper"
    },
    {
        id: 4,
        title: "Cách Chọn Ngày Giờ Tốt Khai Trương",
        excerpt: "Hướng dẫn cách xem và chọn ngày giờ tốt để khai trương cửa hàng, công ty theo phong thủy và lịch âm.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2025-11-20",
        views: 2100,
        image: "https://img.youtube.com/vi/GAK0ZEXjZxk/maxresdefault.jpg",
        emoji: "Confetti",
        videoUrl: "https://www.youtube.com/embed/GAK0ZEXjZxk"
    },
    {
        id: 5,
        title: "Màu Sắc May Mắn Theo Mệnh",
        excerpt: "Khám phá màu sắc phù hợp với từng mệnh Kim, Mộc, Thủy, Hỏa, Thổ để tăng vận may và hạnh phúc.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2025-11-15",
        views: 1420,
        image: "../img/blog/content/mau-sac-may-man-theo-menh.jpg",
        emoji: "Rainbow"
    },
    {
        id: 6,
        title: "12 Con Giáp và Ý Nghĩa",
        excerpt: "Tìm hiểu về 12 con giáp trong văn hóa phương Đông, đặc điểm tính cách và vận mệnh của từng con giáp.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2025-11-10",
        views: 3200,
        image: "../img/blog/content/12-con-giap-y-nghia.webp",
        emoji: "Dragon"
    },
    {
        id: 7,
        title: "Ngày Rằm - Ý Nghĩa và Phong Tục",
        excerpt: "Tìm hiểu về ý nghĩa của ngày rằm trong văn hóa Việt Nam và các phong tục truyền thống vào ngày này.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2025-11-05",
        views: 890,
        image: "../img/blog/content/ngay-ram.jpg",
        emoji: "Full moon"
    },
    {
        id: 8,
        title: "Cách Bố Trí Bàn Thờ Theo Phong Thủy",
        excerpt: "Hướng dẫn chi tiết cách bố trí bàn thờ gia tiên hợp phong thủy, đúng với truyền thống Việt Nam.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2025-10-30",
        views: 1670,
        image: "../img/blog/content/ban-tho-khai-truong.jpg",
        emoji: "Candle"
    },
    {
        id: 9,
        title: "Xem Ngày Cưới Hỏi Theo Tuổi",
        excerpt: "Hướng dẫn cách chọn ngày cưới hỏi hợp tuổi vợ chồng, mang lại hạnh phúc và bền vững cho gia đình.",
        category: "lich",
        categoryName: "Lịch Âm Dương",
        date: "2025-10-25",
        views: 2890,
        image: "../img/blog/content/cuoi-hoi.jpg",
        emoji: "Couple"
    }
];

let currentCategory = 'all';
let currentPage = 1;
const postsPerPage = 9;

document.addEventListener('DOMContentLoaded', function () {
    renderBlogPosts();
    initCategoryButtons();
});

// Hàm định dạng ngày chuẩn Việt Nam: 20/11/2025
function formatDate(dateStr) {
    if (!dateStr) return "Đang cập nhật";
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

// Render danh sách bài viết
function renderBlogPosts() {
    const container = document.getElementById('blogPosts');
    if (!container) return;

    let filteredPosts = currentCategory === 'all' 
        ? blogPosts 
        : blogPosts.filter(p => p.category === currentCategory);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = filteredPosts.slice(start, end);

    if (postsToShow.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; grid-column:1/-1; padding:50px; font-size:1.1em;">Chưa có bài viết nào trong danh mục này.</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    container.innerHTML = postsToShow.map(post => `
        <div class="blog-card" onclick="openBlogPost(${post.id})">
            <div class="blog-card-image">
                ${post.image ? `
                    <img 
                        src="${post.image}" 
                        alt="${post.title}" 
                        loading="lazy" 
                        decoding="async"
                        class="lazy-img"
                        onerror="this.style.display='none'; this.parentElement.querySelector('.emoji-placeholder').style.display='flex';"
                    >
                ` : ''}
                <div class="emoji-placeholder" style="display: ${post.image ? 'none' : 'flex'};">
                    ${post.emoji}
                </div>
                ${post.videoUrl ? '<span class="video-badge">Video</span>' : ''}
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${post.categoryName}</span>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-meta">
                    <span>Calendar ${formatDate(post.date)}</span>
                    <span>Eye ${post.views.toLocaleString('vi-VN')} lượt xem</span>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination(totalPages);
}

// Nút phân trang
function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container || totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Trước</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            html += `<button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
        } else if (Math.abs(i - currentPage) === 3) {
            html += '<span>...</span>';
        }
    }
    
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Sau</button>`;
    container.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil((currentCategory === 'all' ? blogPosts : blogPosts.filter(p => p.category === currentCategory)).length / postsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderBlogPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Nút danh mục
function initCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category || 'all';
            currentPage = 1;
            renderBlogPosts();
        });
    });
}

// Mở bài viết chi tiết
function openBlogPost(id) {
    const map = {
        1: 'cach-xem-lich-am-duong.html',
        2: 'phong-thuy-nha-o.html',
        3: 'y-nghia-tet-nguyen-dan.html',
        4: 'cach-chon-ngay-khai-truong.html',
        5: 'mau-sac-may-man-theo-menh.html',
        6: '12-con-giap-y-nghia.html',
        7: 'ngay-ram-y-nghia.html',
        8: 'cach-bo-tri-ban-tho.html',
        9: 'xem-ngay-cuoi-hoi.html'
    };
    
    if (map[id]) {
        window.location.href = map[id];
    } else {
        alert('Bài viết đang được cập nhật. Vui lòng quay lại sau nhé!');
    }
}

// HIỆU ỨNG LOADING
window.addEventListener("load", function () {
    const loading = document.getElementById("blogLoading");
    if (loading) {
        setTimeout(() => {
            loading.classList.add("hidden");
            document.body.classList.add("loading-done");
        }, 800);
    }
});

// LAZY LOADING ẢNH + HIỆU ỨNG MƯỢT
document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img.lazy-img");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "100px" });

    lazyImages.forEach(img => observer.observe(img));
});
