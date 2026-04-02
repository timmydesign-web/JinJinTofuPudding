document.addEventListener('DOMContentLoaded', () => {
    
    // --- 轉場動畫 ---
    const splashScreen = document.getElementById('splash-screen');
    window.scrollTo(0, 0);
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
    }, 2000);

    // --- 選單與分頁切換 ---
    const menuToggle = document.getElementById('menuToggle');
    const sideNav = document.getElementById('sideNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');

    function toggleMenu() {
        menuToggle.classList.toggle('open');
        sideNav.classList.toggle('open');
        navOverlay.classList.toggle('open');
    }

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            if (targetId === 'info-section') {
                toggleMenu();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                return;
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            pageSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            toggleMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(triggerAnimations, 100); 
        });
    });

    // --- 導航列捲動毛玻璃效果 ---
    const topNavBar = document.getElementById('topNavBar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNavBar.classList.add('scrolled');
        } else {
            topNavBar.classList.remove('scrolled');
        }
    });

    // --- Fade-in up 動畫監聽 ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    function triggerAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => {
            if (!el.classList.contains('in-view') && el.closest('.active')) {
                observer.observe(el);
            }
        });
    }

    triggerAnimations();

    // --- 季節菜單按鈕「濾鏡」切換邏輯 ---
    const seasonTabs = document.querySelectorAll('.season-tab');
    const fullMenuWrapper = document.getElementById('full-menu-wrapper');

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 切換按鈕樣式
            seasonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 判斷套用或移除 is-summer 來觸發 CSS 動畫縮放
            const target = tab.getAttribute('data-target');
            if (target === 'summer') {
                fullMenuWrapper.classList.add('is-summer');
            } else {
                fullMenuWrapper.classList.remove('is-summer');
            }
        });
    });

    // --- 即時時鐘與營業狀態邏輯 ---
    function updateLiveClock() {
        const now = new Date();
        
        // 格式化時間 (HH:MM:SS)
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        document.getElementById('liveClock').textContent = timeString;

        const day = now.getDay(); // 0 是週日, 3 是週三
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        let status = "";
        let statusClass = "";
        let note = "營業時間 10:00am - 09:30pm";

        // 時間計算轉換為分鐘，方便比對 (10:00 = 600, 21:30 = 1290)
        const currentMinutes = hours * 60 + minutes;
        const openTime = 10 * 60;
        const closeTime = 21 * 60 + 30;
        const warningTime = closeTime - 30; // 21:00

        if (day === 3) {
            // 週三特殊規則
            note = "今日營業時間 10:00起 (售完為止)";
            if (currentMinutes < openTime) {
                status = "準備中";
                statusClass = "closed";
            } else {
                status = "營業中";
                statusClass = "open";
            }
        } else {
            // 一般營業時間規則
            if (currentMinutes < openTime || currentMinutes >= closeTime) {
                status = "休息中";
                statusClass = "closed";
            } else if (currentMinutes >= warningTime) {
                status = "即將休息";
                statusClass = "warning";
                note = "距離休息時間剩餘不到 30 分鐘囉！";
            } else {
                status = "營業中";
                statusClass = "open";
            }
        }

        // 更新 UI
        const badge = document.getElementById('statusBadge');
        badge.textContent = status;
        badge.className = 'status-badge ' + statusClass;
        document.getElementById('statusNote').textContent = note;
    }

    // 啟動時鐘，每秒更新一次
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
});
