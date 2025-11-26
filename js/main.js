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

    // --- LOGIC TÍNH ÂM LỊCH (Giả lập để mô phỏng chu kỳ) ---
    // Chúng ta sẽ dùng một "offset" (độ lệch) để giả lập ngày 1 Âm Lịch rơi vào một ngày Dương Lịch khác nhau mỗi tháng.
    function getLunarDay(gregorianDate, currentYearMonth) {
        const day = gregorianDate.getDate();
        const month = gregorianDate.getMonth();
        const year = gregorianDate.getFullYear();
        
        // Tạo một seed (hạt giống) dựa trên năm và tháng hiện tại để tạo ra độ lệch (offset) giả lập.
        // Điều này giúp mùng 1 Âm Lịch không phải lúc nào cũng rơi vào mùng 1 Dương Lịch.
        const seed = (year * 13 + month) % 7; 
        const lunarCycleStartOffset = 5 + seed; // Giả lập ngày Dương Lịch mà mùng 1 Âm Lịch bắt đầu (từ ngày 5 đến ngày 11 DL)

        // Tính ngày trong chu kỳ Âm Lịch 30 ngày
        let lunarDay = day - lunarCycleStartOffset; 
        
        if (lunarDay < 1) {
            // Nếu ngày Âm Lịch nhỏ hơn 1, nó thuộc tháng trước. Giả lập 30 ngày.
            lunarDay = 30 + lunarDay; 
        }

        // Đảm bảo không vượt quá 30 ngày (độ dài chu kỳ Âm Lịch giả lập)
        lunarDay = (lunarDay % 30);
        if (lunarDay === 0) lunarDay = 30;

        // Nếu là ngày mùng 1 Âm Lịch, thêm tháng Âm Lịch (giả lập)
        if (lunarDay === 1) {
            // Giả lập tháng Âm Lịch là (Tháng Dương Lịch hiện tại + 1), để tránh hiển thị 1/12 khi tháng 12
            let lunarMonth = (month % 12) + 1; 
            return `1/${lunarMonth}`;
        }
        
        return String(lunarDay);
    }

    // --- RENDER LỊCH ---
    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;
        const currentYearMonth = year * 100 + month; // Dùng để tạo seed

        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // --- BƯỚC 1: Ngày của Tháng Trước ---
        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            const prevMonthDate = new Date(year, month - 1, day);
            // Lấy ngày Âm Lịch từ tháng trước
            const lunarText = getLunarDay(prevMonthDate, year * 100 + (month - 1)); 

            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="lunar-number">${lunarText}</span>
            `;
            calendarBody.appendChild(dayCell);
        }

        // --- BƯỚC 2: Ngày của Tháng Hiện Tại ---
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.dataset.date = `${year}-${month + 1}-${day}`;

            const isToday = (day === today) && (month === currentMonthForToday) && (year === currentYearForToday);
            if (isToday) {
                dayCell.classList.add('active'); 
            }

            const thisMonthDate = new Date(year, month, day);
            const lunarText = getLunarDay(thisMonthDate, currentYearMonth);
            
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

        // --- BƯỚC 3: Ngày của Tháng Kế Tiếp ---
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; 

        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            const nextMonthDate = new Date(year, month + 1, day);
            // Lấy ngày Âm Lịch từ tháng sau
            const lunarText = getLunarDay(nextMonthDate, year * 100 + (month + 1)); 

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
            toggleNotificationBtn.style.color = '#dc3545'; // Màu đỏ khi bật
            alert("Thông báo ngày đã được BẬT!");
        } else {
            toggleNotificationBtn.innerHTML = '<i class="fas fa-bell"></i> Bật thông báo ngày';
            toggleNotificationBtn.style.color = 'var(--primary-color)';
            alert("Thông báo ngày đã được TẮT!");
        }
    });

    // Khởi tạo lịch
    renderCalendar(currentMonth, currentYear);
});