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

    // --- LOGIC TÍNH ÂM LỊCH (Giả lập để mô phỏng chu kỳ và hiển thị Ngày/Tháng) ---
    function getLunarDay(gregorianDate) {
        const day = gregorianDate.getDate();
        const month = gregianDate.getMonth();
        const year = gregorianDate.getFullYear();
        
        // 1. Giả lập Tháng Âm Lịch
        // Dùng một seed (hạt giống) dựa trên năm và tháng hiện tại để tạo ra độ lệch
        const seed = (year * 13 + month) % 7; 
        
        // Giả lập ngày Dương Lịch mà mùng 1 Âm Lịch bắt đầu (từ ngày 5 đến ngày 11 DL)
        const lunarCycleStartOffset = 5 + seed; 
        
        // Giả lập Tháng Âm Lịch: 
        // Bắt đầu từ tháng 1 (tháng Âm 1 = tháng 1 DL) và thay đổi dựa trên offset.
        let lunarMonth = (month % 12) + 1; 
        
        // 2. Tính Ngày Âm Lịch trong chu kỳ 30 ngày
        let lunarDay = day - lunarCycleStartOffset; 
        
        // Xử lý ngày thuộc tháng trước
        if (lunarDay < 1) {
            lunarDay = 30 + lunarDay; 
            // Nếu ngày thuộc tháng trước, tháng Âm Lịch cũng phải lùi lại 1
            lunarMonth = (lunarMonth === 1) ? 12 : lunarMonth - 1;
        } else {
            // Đảm bảo ngày không vượt quá 30
            lunarDay = (lunarDay % 30);
            if (lunarDay === 0) lunarDay = 30;
        }

        // Nếu ngày dương lịch >= 25, giả lập đã sang tháng âm lịch mới (tăng tính thực tế)
        if (day >= 25 && lunarDay > 20) {
            // Giả lập mùng 1 Âm Lịch tiếp theo
            if (lunarDay > 28) {
                lunarMonth = (lunarMonth % 12) + 1;
            }
        }
        
        // Định dạng cuối cùng: Ngày/Tháng
        return `${lunarDay}/${lunarMonth}`;
    }

    // --- RENDER LỊCH ---
    function renderCalendar(month, year) {
        calendarBody.innerHTML = '';
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;
        
        // Sử dụng một đối tượng Date để tránh lỗi ngày lặp lại khi chuyển tháng
        const tempDate = new Date(year, month, 1);

        const firstDayOfMonth = tempDate.getDay(); 
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
            toggleNotificationBtn.style.color = '#dc3545';
            // Không nên dùng alert trong ứng dụng thực tế, nên dùng modal
            // alert("Thông báo ngày đã được BẬT!"); 
        } else {
            toggleNotificationBtn.innerHTML = '<i class="fas fa-bell"></i> Bật thông báo ngày';
            toggleNotificationBtn.style.color = 'var(--primary-color)';
            // alert("Thông báo ngày đã được TẮT!");
        }
    });

    // Khởi tạo lịch
    renderCalendar(currentMonth, currentYear);
});