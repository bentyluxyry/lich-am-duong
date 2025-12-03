// Khởi tạo biến toàn cục
let currentDate = new Date();
let blogPosts = [];

// Danh sách thứ và tháng
const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                   'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

// Danh sách vận may
const fortunes = [
    "🌟 Hôm nay là ngày tốt lành! Vận may sẽ đến với bạn trong công việc và tình cảm.",
    "💝 Tình duyên của bạn rất tốt hôm nay. Hãy mạnh dạn thể hiện tình cảm của mình.",
    "💼 Công việc sẽ thuận lợi, có cơ hội thăng tiến. Hãy nỗ lực hết mình!",
    "🍀 May mắn sẽ mỉm cười với bạn. Đây là ngày tốt để bắt đầu những dự án mới.",
    "⚠️ Hôm nay nên thận trọng trong giao tiếp, tránh xung đột không đáng có.",
    "💰 Tài lộc hanh thông, có thể có tin vui về tài chính.",
    "🌈 Tâm trạng vui vẻ, gặp được nhiều điều may mắn bất ngờ.",
    "📚 Ngày tốt cho việc học tập và nghiên cứu. Hãy tận dụng!",
    "❤️ Gia đình sum vầy, hạnh phúc tràn đầy. Hãy dành thời gian cho người thân.",
    "🎯 Mọi kế hoạch đều suôn sẻ. Đây là lúc để thực hiện những ý tưởng táo bạo.",
];

// ==================== TAB SWITCHING ====================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Ẩn tất cả tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Bỏ active khỏi tất cả button
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Hiển thị tab được chọn
    document.getElementById(tabName).classList.add('active');
    
    // Thêm active vào button được chọn
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Render nội dung nếu cần
    if (tabName === 'calendar') {
        renderCalendar();
    } else if (tabName === 'blog') {
        renderBlogPosts();
    }
}

// ==================== LUNAR CALENDAR ====================
// Thuật toán chuyển đổi dương lịch sang âm lịch chính xác
function jdFromDate(dd, mm, yy) {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}

function getNewMoonDay(k, timeZone) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) {
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    const JdNew = Jd1 + C1 - deltat;
    return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = Math.floor((jdFromDate(31, 12, yy) - 2415021) / 365.25 * 12);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}

function getLeapMonthOffset(a11, timeZone) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = Math.floor((getNewMoonDay(k + i, timeZone) - 2415021) / 365.25 * 12);
    do {
        last = arc;
        i++;
        arc = Math.floor((getNewMoonDay(k + i, timeZone) - 2415021) / 365.25 * 12);
    } while (arc !== last && i < 14);
    return i - 1;
}

function getLunarDate(date) {
    const timeZone = 7; // UTC+7 cho Việt Nam
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yy = date.getFullYear();
    
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }
    
    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    
    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    
    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap
    };
}

// ==================== CALENDAR RENDERING ====================
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Cập nhật tiêu đề tháng
    document.getElementById('currentDate').textContent = 
        `${monthNames[month]} ${year}`;

    // Hiển thị thông tin ngày hôm nay
    const today = new Date();
    const lunar = getLunarDate(today);
    const lunarText = lunar.leap ? `${lunar.day}/${lunar.month} nhuận` : `${lunar.day}/${lunar.month}`;
    
    document.getElementById('lunarInfo').innerHTML = `
        <strong>Hôm nay: ${daysOfWeek[today.getDay()]}, ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}</strong>
        <div class="lunar-date-large">Âm lịch: ${lunarText}</div>
        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Năm ${lunar.year}</div>
    `;

    // Tính toán các ngày trong tháng
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = '';
    
    // Header các ngày trong tuần
    daysOfWeek.forEach(day => {
        html += `<div class="day-header">${day}</div>`;
    });

    // Các ngày của tháng trước
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<div class="day-cell other-month">
            <div class="solar-date">${day}</div>
        </div>`;
    }

    // Các ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const lunar = getLunarDate(date);
        const lunarDisplay = lunar.day === 1 ? `${lunar.day}/${lunar.month}` : lunar.day;
        const isToday = date.toDateString() === today.toDateString();
        const isFirstDay = lunar.day === 1 ? 'first-day' : '';
        
        html += `<div class="day-cell ${isToday ? 'today' : ''}">
            <div class="solar-date">${day}</div>
            <div class="lunar-date ${isFirstDay}">${lunarDisplay}</div>
        </div>`;
    }

    // Các ngày của tháng sau (để lấp đầy lưới)
    const remainingCells = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="day-cell other-month">
            <div class="solar-date">${day}</div>
        </div>`;
    }

    document.getElementById('calendarGrid').innerHTML = html;
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// ==================== FORTUNE ====================
function getFortune() {
    const random = Math.floor(Math.random() * fortunes.length);
    const result = document.getElementById('fortuneResult');
    result.innerHTML = `<div class="fortune-result">${fortunes[random]}</div>`;
}

// ==================== BLOG ====================
function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    
    let videoId = '';
    
    // Xử lý link dạng youtu.be
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } 
    // Xử lý link dạng youtube.com/watch
    else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v');
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

function addBlogPost() {
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    const youtubeUrl = document.getElementById('youtubeUrl').value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!title || !content) {
        alert('Vui lòng nhập tiêu đề và nội dung!');
        return;
    }

    // Tạo bài viết mới
    const post = {
        id: Date.now(),
        title: title,
        content: content,
        youtubeUrl: youtubeUrl,
        date: new Date().toLocaleString('vi-VN')
    };

    // Thêm vào đầu danh sách
    blogPosts.unshift(post);
    
    // Lưu vào localStorage
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // Xóa form
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogContent').value = '';
    document.getElementById('youtubeUrl').value = '';
    
    // Render lại danh sách
    renderBlogPosts();
}

function deleteBlogPost(id) {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
        blogPosts = blogPosts.filter(post => post.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        renderBlogPosts();
    }
}

function renderBlogPosts() {
    const container = document.getElementById('blogPosts');
    
    if (blogPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 40px 0;">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p>';
        return;
    }

    let html = '';
    blogPosts.forEach(post => {
        const embedUrl = getYouTubeEmbedUrl(post.youtubeUrl);
        html += `
            <div class="blog-post">
                <h3>${post.title}</h3>
                <div class="date">📅 ${post.date}</div>
                <p>${post.content.replace(/\n/g, '<br>')}</p>
                ${embedUrl ? `
                    <div class="video-container">
                        <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                ` : ''}
                <button onclick="deleteBlogPost(${post.id})" style="
                    margin-top: 10px;
                    padding: 8px 15px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">🗑️ Xóa</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadBlogPosts() {
    const saved = localStorage.getItem('blogPosts');
    if (saved) {
        blogPosts = JSON.parse(saved);
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tabs
    initTabs();
    
    // Load dữ liệu blog từ localStorage
    loadBlogPosts();
    
    // Render lịch ban đầu
    renderCalendar();
    
    // Event listeners cho calendar
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    
    // Event listener cho fortune
    document.getElementById('fortuneBtn').addEventListener('click', getFortune);
    
    // Event listener cho blog
    document.getElementById('postBtn').addEventListener('click', addBlogPost);
    
    // Cho phép Enter để đăng bài
    document.getElementById('blogContent').addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            addBlogPost();
        }
    });
});
