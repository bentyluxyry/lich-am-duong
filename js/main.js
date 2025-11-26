document.addEventListener('DOMContentLoaded', () => {
    // --- KHAI BÁO CÁC PHẦN TỬ DOM ---
    const displayMonthYear = document.getElementById('displayMonthYear');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const modal = document.getElementById('dayDetailModal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalDateDisplay = document.getElementById('modalDateDisplay');
    const noteInput = document.getElementById('noteInput');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const reminderList = document.getElementById('reminderList');
    const addReminderBtn = document.getElementById('addReminderBtn');
    
    let currentMonth = new Date().getMonth(); // 0-11
    let currentYear = new Date().getFullYear();
    let selectedDateKey = ''; // Key cho Local Storage: YYYYMMDD

    // Dữ liệu giả lập cho lịch âm (CHỈ LÀ VÍ DỤ, cần thay bằng thư viện Lịch Âm thực tế)
    const lunarData = {
        '20251126': '6/10', // Ví dụ: 26/11 DL là 6/10 AL
        '20251201': '1/11',
        '20251230': '30/11'
    };

    function getLunarDate(year, month, day) {
        // Month là 0-index, cần +1 khi tạo key
        const key = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        // Lấy dữ liệu từ mock data hoặc trả về placeholder
        return lunarData[key] || (day % 3 === 0 ? 'L.M.' : 'L.N.');
    }


    // --- HÀM LOCAL STORAGE CHO GHI CHÚ (NOTES) ---
    function saveNote(dateKey, content) {
        localStorage.setItem(`note_${dateKey}`, content);
    }

    function loadNote(dateKey) {
        return localStorage.getItem(`note_${dateKey}`) || '';
    }
    
    // --- HÀM LOCAL STORAGE CHO REMINDERS ---
    function saveReminders(dateKey, reminders) {
        // Lưu mảng reminders dưới dạng chuỗi JSON
        localStorage.setItem(`reminders_${dateKey}`, JSON.stringify(reminders));
    }

    function loadReminders(dateKey) {
        const json = localStorage.getItem(`reminders_${dateKey}`);
        // Trả về mảng rỗng nếu chưa có dữ liệu
        return json ? JSON.parse(json) : [];
    }
    
    // --- HÀM HIỂN THỊ REMINDERS TRONG MODAL ---
    function displayReminders(dateKey) {
        const reminders = loadReminders(dateKey);
        reminderList.innerHTML = '';
        
        reminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" data-index="${index}" ${reminder.done ? 'checked' : ''}>
                <span class="${reminder.done ? 'reminder-done' : ''}">${reminder.text}</span>
                <button class="delete-reminder" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            reminderList.appendChild(li);
        });
    }


    // --- LOGIC RENDER LỊCH (TẠO CÁC Ô NGÀY) ---
    function renderCalendar() {
        // ... (Giữ nguyên logic render header CN, T2, T3...)
        calendarGrid.innerHTML = ''; 
        
        // Re-add day headers (CN, T2,...)
        const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        dayHeaders.forEach(day => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-header-day';
            headerDiv.textContent = day;
            calendarGrid.appendChild(headerDiv);
        });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        displayMonthYear.textContent = `Tháng ${currentMonth + 1}, ${currentYear}`;

        // 1. Fill in previous month's days
        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day prev-month';
            dayDiv.innerHTML = `<span class="solar-date">${day}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth - 1, day)}</span>`;
            calendarGrid.appendChild(dayDiv);
        }

        // 2. Fill in current month's days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            const lunarText = getLunarDate(currentYear, currentMonth, i);
            
            // Tạo Key định dạng YYYYMMDD cho Local Storage
            const dateKey = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(i).padStart(2, '0')}`;
            
            // Kiểm tra xem ngày có ghi chú/reminder không để thêm dấu chấm nhỏ
            const hasNoteOrReminder = loadNote(dateKey) || loadReminders(dateKey).length > 0;
            
            dayDiv.className = 'calendar-day';
            dayDiv.innerHTML = `
                <span class="solar-date">${i}</span>
                <span class="lunar-date">${lunarText}</span>
                ${hasNoteOrReminder ? '<span class="indicator-dot"></span>' : ''}
            `;
            
            // Highlight today's date
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            // --- THÊM EVENT LISTENER CHO GHI CHÚ/REMINDER ---
            dayDiv.addEventListener('click', () => openDayDetail(dateKey, i, currentMonth, currentYear));

            calendarGrid.appendChild(dayDiv);
        }

        // 3. Fill in next month's days
        const totalCells = firstDayOfMonth + daysInMonth;
        const cellsNeeded = Math.ceil(totalCells / 7) * 7;
        const remainingCells = cellsNeeded - totalCells; 
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day next-month';
            dayDiv.innerHTML = `<span class="solar-date">${i}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth + 1, i)}</span>`;
            calendarGrid.appendChild(dayDiv);
        }
    }


    // --- HÀM XỬ LÝ MODAL CHI TIẾT NGÀY ---
    function openDayDetail(dateKey, day, month, year) {
        selectedDateKey = dateKey;
        
        // 1. Cập nhật tiêu đề ngày
        modalDateDisplay.textContent = `Chi tiết ngày ${day}/${month + 1}/${year}`;
        
        // 2. Tải Ghi chú
        noteInput.value = loadNote(dateKey);
        
        // 3. Tải Reminders
        displayReminders(dateKey);
        
        // 4. Mở Modal
        modal.style.display = 'block';
    }

    // --- XỬ LÝ LƯU GHI CHÚ ---
    saveNoteBtn.addEventListener('click', () => {
        saveNote(selectedDateKey, noteInput.value.trim());
        alert('Đã lưu ghi chú!');
        // Tải lại lịch để hiển thị dấu chấm chỉ báo (indicator dot)
        renderCalendar(); 
    });
    
    // --- XỬ LÝ THÊM REMINDER ---
    addReminderBtn.addEventListener('click', () => {
        const text = prompt('Nhập nội dung Reminder:');
        if (text) {
            const reminders = loadReminders(selectedDateKey);
            reminders.push({ text: text, done: false });
            saveReminders(selectedDateKey, reminders);
            displayReminders(selectedDateKey);
            renderCalendar(); // Tải lại lịch
        }
    });

    // --- XỬ LÝ REMINDER CHECKBOX & XÓA ---
    reminderList.addEventListener('click', (e) => {
        const reminders = loadReminders(selectedDateKey);
        
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.dataset.index);
            reminders[index].done = e.target.checked;
            saveReminders(selectedDateKey, reminders);
            displayReminders(selectedDateKey); // Tải lại để áp dụng style
        }
        
        if (e.target.classList.contains('delete-reminder') || e.target.parentElement.classList.contains('delete-reminder')) {
            const btn = e.target.closest('.delete-reminder');
            const index = parseInt(btn.dataset.index);
            reminders.splice(index, 1); // Xóa phần tử
            saveReminders(selectedDateKey, reminders);
            displayReminders(selectedDateKey);
            renderCalendar(); // Tải lại lịch
        }
    });


    // --- XỬ LÝ ĐÓNG MODAL ---
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    // Đóng Modal khi click ra ngoài
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });


    // --- EVENT LISTENER CHO ĐIỀU HƯỚNG LỊCH ---
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