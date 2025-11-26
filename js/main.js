document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthYearSpan = document.getElementById('current-month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');

    // Mốc thời gian hiện tại
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    const currentMonthForToday = currentDate.getMonth();
    const currentYearForToday = currentDate.getFullYear();

    // --- LOGIC TÍNH ÂM LỊCH (Đơn giản hóa cho mục đích demo) ---
    // Trong thực tế, đây là một thư viện phức tạp. Ở đây chỉ dùng số ngẫu nhiên
    // hoặc một hàm giả lập để hiển thị L.N. (Lịch Nhuận/Âm)
    function getLunarDay(gregorianDate) {
        // Giả lập ngày âm lịch ngẫu nhiên từ 1 đến 30
        const date = gregorianDate.getDate();
        const lunarDay = (date % 30) + 1; 

        // Thêm "1/1" cho ngày đầu tiên của tháng để giả lập Tết
        if (date === 1 && gregorianDate.getMonth() === 0) {
             return '1/1'; // Giả lập Tết Dương Lịch là 1/1 Âm Lịch
        }
        
        // Trả về ngày âm lịch và tháng (giả định)
        // Ví dụ: L.N. 1/1, L.N. 15, L.N. 2
        return `L.N. ${lunarDay}`;
    }

    // --- RENDER LỊCH ---
    function renderCalendar(month, year) {
        // Xóa nội dung cũ
        calendarBody.innerHTML = '';
        
        // Đặt lại tiêu đề tháng/năm
        currentMonthYearSpan.textContent = `Tháng ${month + 1}, ${year}`;

        // 1. Tìm ngày đầu tiên của tháng (thứ mấy)
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (CN) đến 6 (T7)
        
        // 2. Tìm tổng số ngày trong tháng
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 3. Tìm tổng số ngày của tháng trước (để điền vào các ô trống)
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // --- BƯỚC 1: Ngày của Tháng Trước ---
        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            // Tạo ngày giả định cho việc tính Âm Lịch
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

            // Kiểm tra xem có phải là ngày hôm nay không
            const isToday = (day === today) && (month === currentMonthForToday) && (year === currentYearForToday);
            if (isToday) {
                dayCell.classList.add('active'); // Thêm class 'active' cho ngày hôm nay
            }

            // Tính toán Ngày Âm Lịch
            const thisMonthDate = new Date(year, month, day);
            const lunarText = getLunarDay(thisMonthDate);
            
            dayCell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="lunar-number">${lunarText}</span>
            `;

            // Xử lý sự kiện click
            dayCell.addEventListener('click', function() {
                // 1. Xóa trạng thái active cũ
                document.querySelectorAll('.day-cell').forEach(cell => {
                    cell.classList.remove('active');
                });

                // 2. Thêm trạng thái active mới
                this.classList.add('active');
                
                // 3. (Optional) Log thông tin ngày được chọn
                console.log('Ngày được chọn:', this.dataset.date);
            });

            calendarBody.appendChild(dayCell);
        }

        // --- BƯỚC 3: Ngày của Tháng Kế Tiếp ---
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; // Đảm bảo luôn có 6 hàng (7 * 6 = 42)

        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell', 'empty-day', 'prev-next-month');
            
            // Tạo ngày giả định cho việc tính Âm Lịch
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

    // Khởi tạo lịch
    renderCalendar(currentMonth, currentYear);
});