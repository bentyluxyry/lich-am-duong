document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthYearSpan = document.getElementById('current-month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const toggleNotificationBtn = document.querySelector('.toggle-notification'); // Lấy nút thông báo

    // Mốc thời gian hiện tại
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    const currentMonthForToday = currentDate.getMonth();
    const currentYearForToday = currentDate.getFullYear();

    // --- LOGIC TÍNH ÂM LỊCH (Giả lập để sửa lỗi hiển thị) ---
    function getLunarDay(gregorianDate) {
        const day = gregorianDate.getDate();
        const month = gregorianDate.getMonth();
        
        // Tạo một chu kỳ giả lập 30 ngày cho mỗi tháng Âm Lịch
        let lunarDay = (day % 30) + 1; 
        
        // Điều chỉnh để ngày 1 Dương Lịch của mỗi tháng hiển thị là Mùng 1 Âm Lịch (Giả lập)
        if (day === 1) {
             // Giả sử mùng 1 Dương Lịch là mùng 1 Âm Lịch của tháng (month + 1)
             return `1/${(month % 12) + 1}`; 
        }

        // Ngày 15 DL (giữa tháng) giả lập là 15 Âm Lịch
        if (day === 15) {
             return '15';
        }

        // Các ngày còn lại: hiển thị ngày Âm Lịch giả lập
        // Dùng một logic đơn giản hóa: 
        // 1 -> 1, 2 -> 2, ..., 30 -> 30.
        // Đây là code giả lập, không phải code tính Âm Lịch thực tế.
        return (day % 30 === 0) ? '30' : String(day % 30);
    }

    // --- RENDER LỊCH ---
    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // --- BƯỚC 1: Ngày của Tháng Trước ---
        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            const prevMonthDate = new Date(year, month - 1, day);
            const lunarText = getLunarDay(prevMonthDate);

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

        // --- BƯỚC 3: Ngày của Tháng Kế Tiếp ---
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; 

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
            toggleNotificationBtn.style.color = '#dc3545'; // Ví dụ: màu đỏ khi bật
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