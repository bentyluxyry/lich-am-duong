document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHAI BÁO DOM & BIẾN TOÀN CỤC ---
    const DOM = {
        displayMonthYear: document.getElementById('displayMonthYear'),
        calendarGrid: document.querySelector('.calendar-grid'),
        prevMonthBtn: document.getElementById('prevMonth'),
        nextMonthBtn: document.getElementById('nextMonth'),
        modal: document.getElementById('dayDetailModal'),
        closeModalBtn: document.querySelector('.close-button'),
        modalDateDisplay: document.getElementById('modalDateDisplay'),
        noteInput: document.getElementById('noteInput'),
        saveNoteBtn: document.getElementById('saveNoteBtn'),
        reminderList: document.getElementById('reminderList'),
        addReminderBtn: document.getElementById('addReminderBtn')
    };
    
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDateKey = ''; // YYYYMMDD
    
    // Dữ liệu giả lập cho lịch âm
    // **LƯU Ý:** Để có lịch âm chính xác, bạn cần một thư viện lịch âm hoặc một API.
    // Logic 'getLunarDate' ở đây chỉ là giả lập.
    const lunarData = {
        '20251126': '6/10', '20251127': '7/10', '20251128': '8/10',
        '20251201': '1/11', '20251230': '30/11'
    };


    // --- 2. LOGIC LOCAL STORAGE (DATA) ---

    function createDateKey(year, monthIndex, day) {
        const monthPadded = String(monthIndex + 1).padStart(2, '0');
        const dayPadded = String(day).padStart(2, '0');
        return `${year}${monthPadded}${dayPadded}`;
    }

    function getLunarDate(year, monthIndex, day) {
        const key = createDateKey(year, monthIndex, day);
        // Thay thế bằng logic tính lịch âm thực tế
        return lunarData[key] || (day % 4 === 0 ? 'L.M.' : 'L.N.'); 
    }

    function saveNote(dateKey, content) {
        localStorage.setItem(`note_${dateKey}`, content);
    }
    function loadNote(dateKey) {
        return localStorage.getItem(`note_${dateKey}`) || '';
    }
    
    function saveReminders(dateKey, reminders) {
        localStorage.setItem(`reminders_${dateKey}`, JSON.stringify(reminders));
    }
    function loadReminders(dateKey) {
        const json = localStorage.getItem(`reminders_${dateKey}`);
        return json ? JSON.parse(json) : [];
    }


    // --- 3. LOGIC XỬ LÝ GIAO DIỆN & LỊCH (UI) ---

    function checkHasData(dateKey) {
        return loadNote(dateKey) || loadReminders(dateKey).length > 0;
    }

    function displayRemindersInModal(dateKey) {
        const reminders = loadReminders(dateKey);
        DOM.reminderList.innerHTML = '';
        
        if (reminders.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Chưa có Reminder nào.";
            li.style.color = 'var(--text-muted)';
            DOM.reminderList.appendChild(li);
            return;
        }

        reminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" data-index="${index}" ${reminder.done ? 'checked' : ''}>
                    <span class="${reminder.done ? 'reminder-done' : ''}">${reminder.text}</span>
                </label>
                <button class="delete-reminder" data-index="${index}" aria-label="Xóa reminder"><i class="fas fa-trash"></i></button>
            `;
            // Thêm class để dễ style
            if (reminder.done) li.classList.add('done-item'); 
            DOM.reminderList.appendChild(li);
        });
    }

    function renderCalendar() {
        // Xóa tất cả các ô ngày (trừ header)
        DOM.calendarGrid.querySelectorAll('.calendar-day').forEach(el => el.remove());

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (CN) -> 6 (T7)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        DOM.displayMonthYear.textContent = `Tháng ${currentMonth + 1}, ${currentYear}`;

        // Lấy ngày tháng trước (Thêm vào đầu lưới để đúng vị trí)
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day prev-month';
            // Tính toán tháng và năm trước
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            
            dayDiv.innerHTML = `<span class="solar-date">${day}</span><span class="lunar-date">${getLunarDate(prevYear, prevMonth, day)}</span>`;
            DOM.calendarGrid.appendChild(dayDiv);
        }

        // Ngày tháng hiện tại
        today = new Date(); 
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = createDateKey(currentYear, currentMonth, i);
            const hasData = checkHasData(dateKey);
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day current-month';
            dayDiv.innerHTML = `
                <span class="solar-date">${i}</span>
                <span class="lunar-date">${getLunarDate(currentYear, currentMonth, i)}</span>
                ${hasData ? '<span class="indicator-dot"></span>' : ''}
            `;
            
            // Đánh dấu ngày hôm nay (today)
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            dayDiv.addEventListener('click', () => openDayDetail(dateKey, i, currentMonth, currentYear));
            DOM.calendarGrid.appendChild(dayDiv);
        }

        // Ngày tháng sau (Lấp đầy hàng cuối cùng)
        const currentDaysCount = DOM.calendarGrid.children.length - 7; 
        const totalCellsInGrid = 42; // Tổng số ô tối đa (7x6)
        const remainingCells = totalCellsInGrid - currentDaysCount; 

        for (let i = 1; i <= (remainingCells % 7 === 0 ? 0 : remainingCells); i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day next-month';
            // Tính toán tháng và năm sau
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

            dayDiv.innerHTML = `<span class="solar-date">${i}</span><span class="lunar-date">${getLunarDate(nextYear, nextMonth, i)}</span>`;
            DOM.calendarGrid.appendChild(dayDiv);
        }
    }

    function openDayDetail(dateKey, day, month, year) {
        selectedDateKey = dateKey;
        
        DOM.modalDateDisplay.textContent = `Chi tiết ngày ${day}/${month + 1}/${year}`;
        DOM.noteInput.value = loadNote(dateKey);
        displayRemindersInModal(dateKey);
        DOM.modal.style.display = 'block';
    }


    // --- 4. EVENT LISTENERS ---

    // Điều hướng lịch
    DOM.prevMonthBtn.addEventListener('click', () => { 
        currentMonth--; 
        if (currentMonth < 0) { currentMonth = 11; currentYear--; } 
        renderCalendar(); 
    });
    DOM.nextMonthBtn.addEventListener('click', () => { 
        currentMonth++; 
        if (currentMonth > 11) { currentMonth = 0; currentYear++; } 
        renderCalendar(); 
    });

    // Lưu Ghi chú
    DOM.saveNoteBtn.addEventListener('click', () => {
        saveNote(selectedDateKey, DOM.noteInput.value.trim());
        DOM.modal.style.display = 'none'; 
        renderCalendar(); 
    });
    
    // Thêm Reminder
    DOM.addReminderBtn.addEventListener('click', () => {
        const text = prompt('Nhập nội dung Reminder:'); 
        if (text && text.trim() !== '') {
            const reminders = loadReminders(selectedDateKey);
            reminders.push({ text: text.trim(), done: false });
            saveReminders(selectedDateKey, reminders);
            displayRemindersInModal(selectedDateKey);
            renderCalendar(); 
        }
    });

    // Xử lý Reminder (Check/Delete)
    DOM.reminderList.addEventListener('click', (e) => {
        const target = e.target;
        if (!selectedDateKey) return;
        let reminders = loadReminders(selectedDateKey);
        
        if (target.type === 'checkbox') {
            const index = parseInt(target.dataset.index);
            reminders[index].done = target.checked;
        } else if (target.closest('.delete-reminder')) {
            const btn = target.closest('.delete-reminder');
            const index = parseInt(btn.dataset.index);
            reminders.splice(index, 1); 
        } else if (target.closest('label') && target.nodeName === 'SPAN') {
             // Cho phép click vào text để toggle
             const checkbox = target.parentElement.querySelector('input[type="checkbox"]');
             if (checkbox) {
                 checkbox.checked = !checkbox.checked;
                 const index = parseInt(checkbox.dataset.index);
                 reminders[index].done = checkbox.checked;
             }
        } else {
            return;
        }

        saveReminders(selectedDateKey, reminders);
        displayRemindersInModal(selectedDateKey);
        renderCalendar();
    });

    // Đóng Modal
    DOM.closeModalBtn.addEventListener('click', () => { DOM.modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === DOM.modal) DOM.modal.style.display = 'none'; });


    // --- 5. KHỞI CHẠY ---
    renderCalendar();
});