// Dữ liệu blog (có thể chuyển sang file JSON riêng)
const blogPosts = [
    {
        id: 1,
        title: "Cách Xem Lịch Âm Dương Chính Xác",
        excerpt: "Hướng dẫn chi tiết cách đọc và tra cứu lịch âm dương, hiểu về Can Chi và ngày tốt xấu trong văn hóa Việt Nam.",
        category: "lich",
        categoryName: "Lịch Âm Dương",
        date: "2024-12-01",
        views: 1250,
        image: "img/blog/lich-am-duong.jpg", // Ảnh đại diện
        emoji: "📅",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        id: 2,
        title: "Phong Thủy Nhà Ở: Những Điều Cần Biết",
        excerpt: "Khám phá các nguyên tắc cơ bản của phong thủy nhà ở để mang lại may mắn và hạnh phúc cho gia đình.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2024-11-28",
        views: 980,
        image: "img/blog/phong-thuy.jpg", // Ảnh đại diện
        emoji: "🏠"
    },
    {
        id: 3,
        title: "Ý Nghĩa Của Tết Nguyên Đán",
        excerpt: "Tìm hiểu về nguồn gốc, ý nghĩa và các phong tục truyền thống trong dịp Tết Nguyên Đán của người Việt.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2024-11-25",
        views: 1580,
        image: "img/blog/tet-nguyen-dan.jpg", // Ảnh đại diện
        emoji: "🎊"
    },
    {
        id: 4,
        title: "Cách Chọn Ngày Giờ Tốt Khai Trương",
        excerpt: "Hướng dẫn cách xem và chọn ngày giờ tốt để khai trương cửa hàng, công ty theo phong thủy và lịch âm.",
        category: "lich",
        categoryName: "Lịch Âm Dương",
        date: "2024-11-20",
        views: 2100,
        image: "img/blog/khai-truong.jpg",
        emoji: "🎉"
    },
    {
        id: 5,
        title: "Màu Sắc May Mắn Theo Mệnh",
        excerpt: "Khám phá màu sắc phù hợp với từng mệnh Kim, Mộc, Thủy, Hỏa, Thổ để tăng vận may và hạnh phúc.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2024-11-15",
        views: 1420,
        image: "img/blog/mau-sac-menh.jpg",
        emoji: "🎨"
    },
    {
        id: 6,
        title: "12 Con Giáp và Ý Nghĩa",
        excerpt: "Tìm hiểu về 12 con giáp trong văn hóa phương Đông, đặc điểm tính cách và vận mệnh của từng con giáp.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2024-11-10",
        views: 3200,
        image: "img/blog/12-con-giap.jpg",
        emoji: "🐉"
    },
    {
        id: 7,
        title: "Ngày Rằm - Ý Nghĩa và Phong Tục",
        excerpt: "Tìm hiểu về ý nghĩa của ngày rằm trong văn hóa Việt Nam và các phong tục truyền thống vào ngày này.",
        category: "vanhoa",
        categoryName: "Văn Hóa",
        date: "2024-11-05",
        views: 890,
        image: "img/blog/ngay-ram.jpg",
        emoji: "🌕"
    },
    {
        id: 8,
        title: "Cách Bố Trí Bàn Thờ Theo Phong Thủy",
        excerpt: "Hướng dẫn chi tiết cách bố trí bàn thờ gia tiên hợp phong thủy, đúng với truyền thống Việt Nam.",
        category: "phongthuy",
        categoryName: "Phong Thủy",
        date: "2024-10-30",
        views: 1670,
        image: "img/blog/ban-tho.jpg",
        emoji: "🕯️"
    },
    {
        id: 9,
        title: "Xem Ngày Cưới Hỏi Theo Tuổi",
        excerpt: "Hướng dẫn cách chọn ngày cưới hỏi hợp tuổi vợ chồng, mang lại hạnh phúc và bền vững cho gia đình.",
        category: "lich",
        categoryName: "Lịch Âm Dương",
        date: "2024-10-25",
        views: 2890,
        image: "img/blog/cuoi-hoi.jpg",
        emoji: "💑"
    }
];

// Biến phân trang
let currentCategory = 'all';
let currentPage = 1;
const postsPerPage = 6;

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    renderBlogPosts();
    initCategoryButtons();
});

// Render blog posts
function renderBlogPosts() {
    const container = document.getElementById('blogPosts');
    
    // Lọc theo category
    let filteredPosts = currentCategory === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === currentCategory);
    
    // Tính toán phân trang
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Render posts
    if (currentPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Không có bài viết nào trong danh mục này.</p>';
        return;
    }
    
    container.innerHTML = currentPosts.map(post => `
        <div class="blog-card" onclick="openBlogPost(${post.id})">
            <div class="blog-card-image">
                ${post.image 
                    ? `<img src="${post.image}" alt="${post.title}">` 
                    : post.emoji
                }
                ${post.videoUrl ? '<span class="video-badge">📹 Video</span>' : ''}
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${post.categoryName}</span>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        📅 ${formatDate(post.date)}
                    </span>
                    <span class="blog-card-views">
                        👁️ ${post.views.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Render pagination
    renderPagination(totalPages);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Category buttons
function initCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class
            this.classList.add('active');
            
            // Update category and reset page
            currentCategory = this.getAttribute('data-category');
            currentPage = 1;
            
            // Re-render
            renderBlogPosts();
        });
    });
}

// Pagination
function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            ← Trước
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `
                <button 
                    class="${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})"
                >
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span style="padding: 10px;">...</span>';
        }
    }
    
    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Sau →
        </button>
    `;
    
    container.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderBlogPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open blog post - Chuyển đến trang chi tiết
function openBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    
    // Map ID sang file HTML tương ứng
    const postFiles = {
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
    
    // Nếu có file, chuyển hướng
    if (postFiles[id]) {
        window.location.href = postFiles[id];
    } else {
        // Nếu chưa có file, hiển thị thông báo
        alert(`Bài viết "${post.title}" đang được cập nhật.\n\nVui lòng quay lại sau!`);
    }
}
