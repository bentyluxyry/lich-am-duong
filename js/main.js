document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthYearSpan = document.getElementById('current-month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const toggleNotificationBtn = document.querySelector('.toggle-notification');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    const currentMonthForToday = currentDate.getMonth();
    const currentYearForToday = currentDate.getFullYear();

    // --- LOGIC TÍNH ÂM LỊCH (Giả lập) ---
    function getLunarDay(gregorianDate) {
        const day = gregorianDate.getDate();
        const month = gregorianDate.getMonth(); // Lỗi cú pháp có thể xảy ra ở đây: nếu dùng gregianDate.getMonth (thiếu o)
        const year = gregorianDate.getFullYear();
        
        // 1. Giả lập Tháng Âm Lịch
        const seed = (year * 13 + month) % 7; 
        const lunarCycleStartOffset = 5 + seed; 
        let lunarMonth = (month % 12) + 1; 
        
        // 2. Tính Ngày Âm Lịch trong chu kỳ 30 ngày
        let lunarDay = day - lunarCycleStartOffset; 
        
        // Xử lý ngày thuộc tháng trước
        if (lunarDay < 1) {
            lunarDay = 30 + lunarDay; 
            lunarMonth = (lunarMonth === 1) ? 12 : lunarMonth - 1;
        } else {
            // Đảm bảo ngày không vượt quá 30
            lunarDay = (lunarDay % 30);
            if (lunarDay === 0) lunarDay = 30;
        }

        // Nếu ngày dương lịch >= 25, giả lập đã sang tháng âm lịch mới (giúp tháng âm chuyển đổi hợp lý)
        if (day >= 25 && lunarDay < 10) { // Nếu ngày Âm Lịch nhỏ (tức là vừa qua mùng 1)
            lunarMonth = (lunarMonth % 12) + 1;
        }
        
        // Định dạng cuối cùng: Ngày/Tháng (ví dụ: 20/10)
        return `${lunarDay}/${lunarMonth}`;
    }

    // --- RENDER LỊCH ---
    function renderCalendar(month, year) {
        // Luôn xóa nội dung cũ trước khi render
        calendarBody.innerHTML = ''; 
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;
        
        // Lấy thông tin ngày
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Thứ của ngày 1 (0=CN, 6=T7)
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Tổng số ngày trong tháng
        const daysInPrevMonth = new Date(year, month, 0).getDate(); // Tổng số ngày tháng trước

        // --- BƯỚC 1: Ngày của Tháng Trước (Ô trống đầu tiên) ---
        // Lặp từ 0 đến (firstDayOfMonth - 1)
        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dayCell = document.createElement('div');
            // Thêm class 'empty-day' để ẩn nội dung (nếu cần) hoặc chỉ hiển thị mờ
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month'); 
            
            const prevMonthDate = new Date(year, month - 1, day);
            const lunarText = getLunarDay(prevMonthDate); 

            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="lunar-number">${lunarText}</span>
            `;
            calendarBody.appendChild(dayCell);
        }

        // --- BƯỚC 2: Ngày của Tháng Hiện Tại (1 đến DaysInMonth) ---
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.dataset.date = `${year}-${month + 1}-${day}`;

            const isToday = (day === today) && (month === currentMonthForToday) && (year === currentYearForToday);
            if (isToday) {
                dayCell.classList.add('active'); 
            }

            const thisMonthDate = new Date(year, month, day);
            const lunarText = getLunarDay(thisMonthDate);
            
            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="lunar-number">${lunarText}</span>
            `;

            // Xử lý sự kiện click
            dayCell.addEventListener('click', function() {
                document.querySelectorAll('.day-cell').forEach(cell => {
                    cell.classList.remove('active');
                });
                this.classList.add('active');
            });

            calendarBody.appendChild(dayCell);
        }

        // --- BƯỚC 3: Ngày của Tháng Kế Tiếp (Điền vào các ô còn lại) ---
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; // 42 là số ô tối đa (6 hàng * 7 cột)

        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            const nextMonthDate = new Date(year, month + 1, day);
            const lunarText = getLunarDay(nextMonthDate); 

            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="lunar-number">${lunarText}</span>
            `;
            calendarBody.appendChild(dayCell);
        }
    }

    // --- XỬ LÝ SỰ KIỆN CHUYỂN THÁNG ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        renderCalendar(currentMonth, currentYear);
    });

    // --- CÀI ĐẶT THÔNG BÁO (Notification Handler) ---
    let notificationsEnabled = false;
    
    toggleNotificationBtn.addEventListener('click', () => {
        notificationsEnabled = !notificationsEnabled;
        
        if (notificationsEnabled) {
            toggleNotificationBtn.innerHTML = '<i class="fas fa-bell"></i> Đang bật thông báo';
            toggleNotificationBtn.style.color = '#dc3545';
        } else {
            toggleNotificationBtn.innerHTML = '<i class="fas fa-bell"></i> Bật thông báo ngày';
            toggleNotificationBtn.style.color = 'var(--primary-color)';
        }
    });

    // Khởi tạo lịch
    renderCalendar(currentMonth, currentYear);
});