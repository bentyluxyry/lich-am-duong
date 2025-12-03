// Dữ liệu mệnh và con giáp
const destinyData = {
    'Kim': {
        name: 'Kim',
        color: '#FFD700',
        element: '🔱 Kim',
        description: 'Mệnh Kim tượng trưng cho sự vững chắc, mạnh mẽ và quyết đoán. Người mệnh Kim thường có ý chí kiên định, tinh thần trách nhiệm cao.',
        personality: [
            'Tính cách mạnh mẽ, quyết đoán',
            'Có tinh thần trách nhiệm cao',
            'Thích sự rõ ràng, minh bạch',
            'Trung thành và đáng tin cậy'
        ],
        luckyColors: ['Trắng', 'Vàng', 'Bạc'],
        luckyNumbers: [4, 9],
        luckyDirection: 'Tây',
        career: 'Kinh doanh, quản lý, kỹ thuật, luật',
        compatible: ['Thủy', 'Thổ'],
        incompatible: ['Hỏa']
    },
    'Mộc': {
        name: 'Mộc',
        color: '#228B22',
        element: '🌳 Mộc',
        description: 'Mệnh Mộc tượng trưng cho sự phát triển, sinh trưởng và sáng tạo. Người mệnh Mộc thường có tính cách hòa nhã, nhân từ.',
        personality: [
            'Tính cách hòa nhã, thân thiện',
            'Sáng tạo và linh hoạt',
            'Yêu thiên nhiên, môi trường',
            'Có khả năng thích nghi tốt'
        ],
        luckyColors: ['Xanh lá', 'Xanh lam', 'Đen'],
        luckyNumbers: [3, 8],
        luckyDirection: 'Đông',
        career: 'Giáo dục, nghệ thuật, thiết kế, nông nghiệp',
        compatible: ['Thủy', 'Hỏa'],
        incompatible: ['Kim']
    },
    'Thủy': {
        name: 'Thủy',
        color: '#4169E1',
        element: '💧 Thủy',
        description: 'Mệnh Thủy tượng trưng cho sự linh hoạt, thông minh và khôn khéo. Người mệnh Thủy thường rất nhạy cảm và có trực giác tốt.',
        personality: [
            'Linh hoạt và thích nghi tốt',
            'Thông minh, nhạy bén',
            'Có khả năng giao tiếp tốt',
            'Trực giác và cảm xúc phong phú'
        ],
        luckyColors: ['Đen', 'Xanh dương', 'Xám'],
        luckyNumbers: [1, 6],
        luckyDirection: 'Bắc',
        career: 'Truyền thông, ngoại giao, nghệ thuật, du lịch',
        compatible: ['Kim', 'Mộc'],
        incompatible: ['Thổ']
    },
    'Hỏa': {
        name: 'Hỏa',
        color: '#FF4500',
        element: '🔥 Hỏa',
        description: 'Mệnh Hỏa tượng trưng cho nhiệt huyết, đam mê và năng lượng. Người mệnh Hỏa thường rất nhiệt tình, năng động.',
        personality: [
            'Nhiệt tình, năng động',
            'Đam mê và quyết tâm cao',
            'Lạc quan, tích cực',
            'Có khả năng lãnh đạo'
        ],
        luckyColors: ['Đỏ', 'Hồng', 'Cam', 'Tím'],
        luckyNumbers: [2, 7],
        luckyDirection: 'Nam',
        career: 'Kinh doanh, marketing, nghệ thuật biểu diễn',
        compatible: ['Mộc', 'Thổ'],
        incompatible: ['Thủy']
    },
    'Thổ': {
        name: 'Thổ',
        color: '#8B4513',
        element: '🏔️ Thổ',
        description: 'Mệnh Thổ tượng trưng cho sự ổn định, tin cậy và bền vững. Người mệnh Thổ thường rất trung thực, đáng tin cậy.',
        personality: [
            'Trung thực và chân thành',
            'Ổn định, đáng tin cậy',
            'Kiên nhẫn và bền bỉ',
            'Có tinh thần trách nhiệm'
        ],
        luckyColors: ['Vàng', 'Nâu', 'Cam'],
        luckyNumbers: [5, 0],
        luckyDirection: 'Trung tâm',
        career: 'Bất động sản, xây dựng, tài chính, giáo dục',
        compatible: ['Hỏa', 'Kim'],
        incompatible: ['Mộc']
    }
};

const zodiacData = {
    'Tý': { name: 'Tý', emoji: '🐭', years: [1960, 1972, 1984, 1996, 2008, 2020] },
    'Sửu': { name: 'Sửu', emoji: '🐮', years: [1961, 1973, 1985, 1997, 2009, 2021] },
    'Dần': { name: 'Dần', emoji: '🐯', years: [1962, 1974, 1986, 1998, 2010, 2022] },
    'Mão': { name: 'Mão', emoji: '🐰', years: [1963, 1975, 1987, 1999, 2011, 2023] },
    'Thìn': { name: 'Thìn', emoji: '🐉', years: [1964, 1976, 1988, 2000, 2012, 2024] },
    'Tỵ': { name: 'Tỵ', emoji: '🐍', years: [1965, 1977, 1989, 2001, 2013] },
    'Ngọ': { name: 'Ngọ', emoji: '🐴', years: [1966, 1978, 1990, 2002, 2014] },
    'Mùi': { name: 'Mùi', emoji: '🐐', years: [1967, 1979, 1991, 2003, 2015] },
    'Thân': { name: 'Thân', emoji: '🐵', years: [1968, 1980, 1992, 2004, 2016] },
    'Dậu': { name: 'Dậu', emoji: '🐔', years: [1969, 1981, 1993, 2005, 2017] },
    'Tuất': { name: 'Tuất', emoji: '🐕', years: [1970, 1982, 1994, 2006, 2018] },
    'Hợi': { name: 'Hợi', emoji: '🐷', years: [1971, 1983, 1995, 2007, 2019] }
};

let selectedGender = 'male';

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    initGenderButtons();
});

// Gender selection
function initGenderButtons() {
    const buttons = document.querySelectorAll('.gender-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedGender = this.getAttribute('data-gender');
        });
    });
}

// Tính mệnh dựa vào năm sinh (Nạp Âm)
function calculateDestiny(year) {
    // Bảng Nạp Âm 60 năm
    const napAmTable = {
        // Giáp Tý, Ất Sửu (1924, 1984, 1925, 1985)
        0: 'Kim', 1: 'Kim',
        // Bính Dần, Đinh Mão (1926, 1986, 1927, 1987)
        2: 'Hỏa', 3: 'Hỏa',
        // Mậu Thìn, Kỷ Tỵ (1928, 1988, 1929, 1989)
        4: 'Mộc', 5: 'Mộc',
        // Canh Ngọ, Tân Mùi (1930, 1990, 1931, 1991)
        6: 'Thổ', 7: 'Thổ',
        // Nhâm Thân, Quý Dậu (1932, 1992, 1933, 1993)
        8: 'Kim', 9: 'Kim',
        // Giáp Tuất, Ất Hợi (1934, 1994, 1935, 1995)
        10: 'Hỏa', 11: 'Hỏa',
        // Bính Tý, Đinh Sửu (1936, 1996, 1937, 1997)
        12: 'Thủy', 13: 'Thủy',
        // Mậu Dần, Kỷ Mão (1938, 1998, 1939, 1999)
        14: 'Thổ', 15: 'Thổ',
        // Canh Thìn, Tân Tỵ (1940, 2000, 1941, 2001)
        16: 'Kim', 17: 'Kim',
        // Nhâm Ngọ, Quý Mùi (1942, 2002, 1943, 2003)
        18: 'Mộc', 19: 'Mộc',
        // Giáp Thân, Ất Dậu (1944, 2004, 1945, 2005)
        20: 'Thủy', 21: 'Thủy',
        // Bính Tuất, Đinh Hợi (1946, 2006, 1947, 2007)
        22: 'Thổ', 23: 'Thổ',
        // Mậu Tý, Kỷ Sửu (1948, 2008, 1949, 2009)
        24: 'Hỏa', 25: 'Hỏa',
        // Canh Dần, Tân Mão (1950, 2010, 1951, 2011)
        26: 'Mộc', 27: 'Mộc',
        // Nhâm Thìn, Quý Tỵ (1952, 2012, 1953, 2013)
        28: 'Thủy', 29: 'Thủy',
        // Giáp Ngọ, Ất Mùi (1954, 2014, 1955, 2015)
        30: 'Kim', 31: 'Kim',
        // Bính Thân, Đinh Dậu (1956, 2016, 1957, 2017)
        32: 'Hỏa', 33: 'Hỏa',
        // Mậu Tuất, Kỷ Hợi (1958, 2018, 1959, 2019)
        34: 'Mộc', 35: 'Mộc',
        // Canh Tý, Tân Sửu (1960, 2020, 1961, 2021)
        36: 'Thổ', 37: 'Thổ',
        // Nhâm Dần, Quý Mão (1962, 2022, 1963, 2023)
        38: 'Kim', 39: 'Kim',
        // Giáp Thìn, Ất Tỵ (1964, 2024, 1965, 2025)
        40: 'Hỏa', 41: 'Hỏa',
        // Bính Ngọ, Đinh Mùi (1966, 2026, 1967, 2027)
        42: 'Thủy', 43: 'Thủy',
        // Mậu Thân, Kỷ Dậu (1968, 2028, 1969, 2029)
        44: 'Thổ', 45: 'Thổ',
        // Canh Tuất, Tân Hợi (1970, 2030, 1971, 2031)
        46: 'Kim', 47: 'Kim',
        // Nhâm Tý, Quý Sửu (1972, 2032, 1973, 2033)
        48: 'Mộc', 49: 'Mộc',
        // Giáp Dần, Ất Mão (1974, 2034, 1975, 2035)
        50: 'Thủy', 51: 'Thủy',
        // Bính Thìn, Đinh Tỵ (1976, 2036, 1977, 2037)
        52: 'Thổ', 53: 'Thổ',
        // Mậu Ngọ, Kỷ Mùi (1978, 2038, 1979, 2039)
        54: 'Hỏa', 55: 'Hỏa',
        // Canh Thân, Tân Dậu (1980, 2040, 1981, 2041)
        56: 'Mộc', 57: 'Mộc',
        // Nhâm Tuất, Quý Hợi (1982, 2042, 1983, 2043)
        58: 'Thủy', 59: 'Thủy'
    };
    
    // Tính chỉ số trong chu kỳ 60 năm
    const index = (year - 1924) % 60;
    
    return napAmTable[index] || 'Kim';
}

// Tính con giáp
function calculateZodiac(year) {
    const zodiacOrder = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
    const index = year % 12;
    return zodiacOrder[index];
}

// Tính tuổi
function calculateAge(year) {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
}

// Xem vận mệnh
function calculateFortune() {
    const day = document.getElementById('birthDay').value;
    const month = document.getElementById('birthMonth').value;
    const year = document.getElementById('birthYear').value;
    
    // Validation
    if (!day || !month || !year) {
        alert('Vui lòng nhập đầy đủ ngày tháng năm sinh!');
        return;
    }
    
    if (day < 1 || day > 31) {
        alert('Ngày sinh không hợp lệ!');
        return;
    }
    
    if (year < 1920 || year > 2024) {
        alert('Năm sinh không hợp lệ!');
        return;
    }
    
    // Tính toán
    const destiny = calculateDestiny(year);
    const zodiac = calculateZodiac(year);
    const age = calculateAge(year);
    
    const destinyInfo = destinyData[destiny];
    const zodiacInfo = zodiacData[zodiac];
    
    // Render kết quả
    renderResult({
        day, month, year,
        gender: selectedGender,
        age,
        destiny: destinyInfo,
        zodiac: zodiacInfo
    });
}

// Render kết quả
function renderResult(data) {
    const container = document.getElementById('fortuneResult');
    const genderText = data.gender === 'male' ? 'Nam' : 'Nữ';
    
    container.innerHTML = `
        <div class="result-header">
            <h2>Kết Quả Xem Mạng Mệnh</h2>
            <div class="destiny-badge" style="background: ${data.destiny.color}22; color: ${data.destiny.color}; border: 2px solid ${data.destiny.color};">
                ${data.destiny.element}
            </div>
        </div>
        
        <div class="result-info">
            <div class="info-card">
                <div class="label">Giới tính</div>
                <div class="value">${data.gender === 'male' ? '👨' : '👩'} ${genderText}</div>
            </div>
            <div class="info-card">
                <div class="label">Ngày sinh</div>
                <div class="value">${data.day}/${data.month}/${data.year}</div>
            </div>
            <div class="info-card">
                <div class="label">Tuổi</div>
                <div class="value">${data.age} tuổi</div>
            </div>
            <div class="info-card">
                <div class="label">Con giáp</div>
                <div class="value">${data.zodiac.emoji} ${data.zodiac.name}</div>
            </div>
        </div>
        
        <div class="result-details">
            <h3>${data.destiny.element} Giới Thiệu Mệnh ${data.destiny.name}</h3>
            <p>${data.destiny.description}</p>
            
            <h3>🎭 Tính Cách</h3>
            <ul>
                ${data.destiny.personality.map(trait => `<li>• ${trait}</li>`).join('')}
            </ul>
            
            <h3>💼 Nghề Nghiệp Phù Hợp</h3>
            <p><strong>Lĩnh vực:</strong> ${data.destiny.career}</p>
            
            <h3>🤝 Tương Sinh & Tương Khắc</h3>
            <p>
                <strong>Tương sinh:</strong> ${data.destiny.compatible.join(', ')}<br>
                <strong>Tương khắc:</strong> ${data.destiny.incompatible.join(', ')}
            </p>
            
            <h3>🍀 Màu Sắc & Số May Mắn</h3>
            <div class="lucky-items">
                <div class="lucky-item">
                    <div class="icon">🎨</div>
                    <div class="text">${data.destiny.luckyColors.join(', ')}</div>
                </div>
                <div class="lucky-item">
                    <div class="icon">🔢</div>
                    <div class="text">${data.destiny.luckyNumbers.join(', ')}</div>
                </div>
                <div class="lucky-item">
                    <div class="icon">🧭</div>
                    <div class="text">${data.destiny.luckyDirection}</div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button class="back-btn" onclick="resetForm()">
                🔄 Xem Lại
            </button>
        </div>
    `;
    
    container.style.display = 'block';
    document.getElementById('fortuneForm').style.display = 'none';
    
    // Scroll to result
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Reset form
function resetForm() {
    document.getElementById('fortuneResult').style.display = 'none';
    document.getElementById('fortuneForm').style.display = 'block';
    
    document.getElementById('birthDay').value = '';
    document.getElementById('birthMonth').value = '';
    document.getElementById('birthYear').value = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
