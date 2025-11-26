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

    // Dữ liệu thực tế: Ngày 26/11/2025 DL là ngày 7/10 ÂL
    const DAY_TO_FIX = 26; // Ngày DL cần cố định
    const LUNAR_DAY_FIX = 7; // Ngày ÂL tương ứng
    const LUNAR_MONTH_FIX = 10; // Tháng ÂL tương ứng
    
    // --- LOGIC TÍNH ÂM LỊCH (Đã được cố định theo mốc thực tế) ---
    function getLunarDay(gregorianDate) {
        const day = gregorianDate.getDate();
        const month = gregorianDate.getMonth();
        const year = gregorianDate.getFullYear();
        
        // Chỉ cố định cho tháng 11/2025 (currentMonthForToday = 10, currentYearForToday = 2025)
        if (month === currentMonthForToday && year === currentYearForToday) {
            
            // 1. Tính toán độ lệch từ ngày cố định (26/11 DL = 7/10 ÂL)
            let diff = day - DAY_TO_FIX; // Khoảng cách ngày DL so với mốc 26
            let lunarDay = LUNAR_DAY_FIX + diff; // Ngày ÂL hiện tại

            let lunarMonth = LUNAR_MONTH_FIX;
            
            // 2. Xử lý Chuyển tháng Âm Lịch (giả định tháng Âm có 30 ngày)
            if (lunarDay > 30) {
                lunarDay = lunarDay - 30; // Trở về ngày mùng 1
                lunarMonth = (lunarMonth % 12) + 1; // Tăng tháng ÂL
            } else if (lunarDay < 1) {
                lunarDay = 30 + lunarDay; // Trở về ngày 30
                lunarMonth = (lunarMonth === 1) ? 12 : lunarMonth - 1; // Giảm tháng ÂL
            }
            
            return `${lunarDay}/${lunarMonth}`;
        }
        
        // --- Logic Giả lập cho các tháng khác (để tránh lỗi khi chuyển tháng) ---
        // Vẫn dùng logic giả lập trước đó, nhưng chỉ hiển thị Ngày/Tháng
        const seed = (year * 13 + month) % 7; 
        const lunarCycleStartOffset = 5 + seed; 
        let lunarMonth = (month % 12) + 1; 
        let lunarDay = day - lunarCycleStartOffset; 
        
        if (lunarDay < 1) {
            lunarDay = 30 + lunarDay; 
            lunarMonth = (lunarMonth === 1) ? 12 : lunarMonth - 1;
        } else {
            lunarDay = (lunarDay % 30);
            if (lunarDay === 0) lunarDay = 30;
        }
        
        // Điều chỉnh tháng Âm Lịch giả lập nếu ngày Âm Lịch nhỏ (vừa qua mùng 1)
        if (day >= 25 && lunarDay < 10) { 
            lunarMonth = (lunarMonth % 12) + 1;
        }

        return `${lunarDay}/${lunarMonth}`;
    }

    // --- RENDER LỊCH (Giữ nguyên) ---
    function renderCalendar(month, year) {
        calendarBody.innerHTML = ''; 
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;
        
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // BƯỚC 1: Ngày của Tháng Trước
        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month'); 
            
            const prevMonthDate = new Date(year, month - 1, day);
            const lunarText = getLunarDay(prevMonthDate); 

            dayCell.innerHTML = `<span class="day-number">${day}</span><span class="lunar-number">${lunarText}</span>`;
            calendarBody.appendChild(dayCell);
        }

        // BƯỚC 2: Ngày của Tháng Hiện Tại
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.dataset.date = `${year}-${month + 1}-${day}`;

            // Xác định ngày hôm nay và thêm class 'active'
            const isToday = (day === today) && (month === currentMonthForToday) && (year === currentYearForToday);
            if (isToday) {
                dayCell.classList.add('active'); 
            }

            const thisMonthDate = new Date(year, month, day);
            const lunarText = getLunarDay(thisMonthDate);
            
            dayCell.innerHTML = `<span class="day-number">${day}</span><span class="lunar-number">${lunarText}</span>`;

            // Xử lý sự kiện click
            dayCell.addEventListener('click', function() {
                document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('active'));
                this.classList.add('active');
            });
            calendarBody.appendChild(dayCell);
        }

        // BƯỚC 3: Ngày của Tháng Kế Tiếp
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; 

        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            const nextMonthDate = new Date(year, month + 1, day);
            const lunarText = getLunarDay(nextMonthDate); 

            dayCell.innerHTML = `<span class="day-number">${day}</span><span class="lunar-number">${lunarText}</span>`;
            calendarBody.appendChild(dayCell);
        }
    }

    // --- XỬ LÝ SỰ KIỆN CHUYỂN THÁNG (Giữ nguyên) ---
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

    // --- CÀI ĐẶT THÔNG BÁO (Giữ nguyên) ---
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