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
    
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDateKey = ''; // YYYYMMDD
    
    // Dữ liệu giả lập cho lịch âm
    const lunarData = {
        '20251126': '6/10', '20251201': '1/11', '20251230': '30/11'
    };


    // --- 2. LOGIC LOCAL STORAGE (DATA) ---

    function getLunarDate(year, month, day) {
        const key = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        return lunarData[key] || (day % 3 === 0 ? 'L.M.' : 'L.N.');
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

    function displayRemindersInModal(dateKey) {
        const reminders = loadReminders(dateKey);
        DOM.reminderList.innerHTML = '';
        
        reminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" data-index="${index}" ${reminder.done ? 'checked' : ''}>
                <span class="${reminder.done ? 'reminder-done' : ''}">${reminder.text}</span>
                <button class="delete-reminder" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            DOM.reminderList.appendChild(li);
        });
    }

    function renderCalendar() {
        const existingDays = DOM.calendarGrid.querySelectorAll('.calendar-day, .calendar-header-day');
        existingDays.forEach((el, index) => { if (index >= 7) el.remove(); });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        DOM.displayMonthYear.textContent = `Tháng ${currentMonth + 1}, ${currentYear}`;

        // 1. Ngày tháng trước
        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = daysInPrevMonth - i + 1;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day prev-month';
            dayDiv.innerHTML = `<span class="solar-date">${day}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth - 1, day)}</span>`;
            DOM.calendarGrid.appendChild(dayDiv);
        }

        // 2. Ngày tháng hiện tại
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(i).padStart(2, '0')}`;
            const hasData = loadNote(dateKey) || loadReminders(dateKey).length > 0;
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.innerHTML = `
                <span class="solar-date">${i}</span>
                <span class="lunar-date">${getLunarDate(currentYear, currentMonth, i)}</span>
                ${hasData ? '<span class="indicator-dot"></span>' : ''}
            `;
            
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            dayDiv.addEventListener('click', () => openDayDetail(dateKey, i, currentMonth, currentYear));
            DOM.calendarGrid.appendChild(dayDiv);
        }

        // 3. Ngày tháng sau
        const totalCells = firstDayOfMonth + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells; 
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day next-month';
            dayDiv.innerHTML = `<span class="solar-date">${i}</span><span class="lunar-date">${getLunarDate(currentYear, currentMonth + 1, i)}</span>`;
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
    DOM.prevMonthBtn.addEventListener('click', () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); });
    DOM.nextMonthBtn.addEventListener('click', () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); });

    // Lưu Ghi chú
    DOM.saveNoteBtn.addEventListener('click', () => {
        saveNote(selectedDateKey, DOM.noteInput.value.trim());
        alert('Đã lưu ghi chú!');
        renderCalendar(); 
    });
    
    // Thêm Reminder
    DOM.addReminderBtn.addEventListener('click', () => {
        const text = prompt('Nhập nội dung Reminder:');
        if (text) {
            const reminders = loadReminders(selectedDateKey);
            reminders.push({ text: text, done: false });
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