document.addEventListener('DOMContentLoaded', () => {
    const displayMonthYear = document.getElementById('displayMonthYear');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentMonth = new Date().getMonth(); // 0-11
    let currentYear = new Date().getFullYear();

    // Dữ liệu giả lập cho lịch âm (có thể thay bằng logic tính toán thực tế)
    // Đây chỉ là ví dụ đơn giản, bạn cần tích hợp thư viện hoặc API lịch âm thực tế
    const lunarData = {
        '2025-10-26': { solar: 26, lunar: '6/10' }, // Ví dụ: 26/10 DL là mùng 6/10 AL
        '2025-11-01': { solar: 1, lunar: '1/11' },
        '2025-11-26': { solar: 26, lunar: '26/11' } // Giả sử 26/11 DL là 26/11 AL cho ví dụ
    };

    function getLunarDate(year, month, day) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Trong một ứng dụng thực tế, bạn sẽ dùng thư viện như 'pylunar' (qua API)
        // hoặc thư viện JS chuyển đổi lịch âm.
        // Đây là mock data.
        return lunarData[key] ? lunarData[key].lunar : (day % 2 === 0 ? 'L.M.' : 'L.N.'); // Placeholder for other days
    }


    function renderCalendar() {
        calendarGrid.innerHTML = ''; // Clear previous days

        // Re-add day headers (CN, T2,...) if they were cleared
        const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        dayHeaders.forEach(day => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-header-day';
            headerDiv.textContent = day;
            calendarGrid.appendChild(headerDiv);
        });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sunday, 1 for Monday
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        displayMonthYear.textContent = `Tháng ${currentMonth + 1}, ${currentYear}`;

        // Fill in previous month's days
        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day prev-month';
            dayDiv.innerHTML = `<span class="solar-date">${day}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth - 1, day)}</span>`;
            calendarGrid.appendChild(dayDiv);
        }

        // Fill in current month's days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.innerHTML = `<span class="solar-date">${i}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth, i)}</span>`;
            
            // Highlight today's date
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            calendarGrid.appendChild(dayDiv);
        }

        // Fill in next month's days to complete the grid (up to 6 rows)
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = 42 - totalCells; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day next-month';
            dayDiv.innerHTML = `<span class="solar-date">${i}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth + 1, i)}</span>`;
            calendarGrid.appendChild(dayDiv);
        }
    }

    // Event Listeners for navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar(); // Initial render
});