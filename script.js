document.addEventListener('DOMContentLoaded', () => {
    
    // --- 開場轉場動畫 ---
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

    // --- 導航列毛玻璃效果 ---
    const topNavBar = document.getElementById('topNavBar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNavBar.classList.add('scrolled');
        } else {
            topNavBar.classList.remove('scrolled');
        }
    });

    // --- 捲動浮現動畫 (Fade-in up) ---
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
            // 🐛 修正：除了檢查是否在 active 分頁內，也要允許「不在任何分頁內」的全局元素（如 Header 時鐘與 Footer 店家資訊）顯示
            if (!el.classList.contains('in-view')) {
                if (el.closest('.active') || !el.closest('.page-section')) {
                    observer.observe(el);
                }
            }
        });
    }

    triggerAnimations();

    // --- 季節菜單按鈕「濾鏡」切換邏輯 ---
    const seasonTabs = document.querySelectorAll('.season-tab');
    const fullMenuWrapper = document.getElementById('full-menu-wrapper');

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            seasonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

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
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        document.getElementById('liveClock').textContent = timeString;

        const day = now.getDay(); 
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        let status = "";
        let statusClass = "";
        let note = "營業時間 10:00am - 09:30pm";

        const currentMinutes = hours * 60 + minutes;
        const openTime = 10 * 60;
        const closeTime = 21 * 60 + 30;
        const warningTime = closeTime - 30;

        if (day === 3) {
            note = "今日營業時間 10:00起 (售完為止)";
            if (currentMinutes < openTime) {
                status = "準備中";
                statusClass = "closed";
            } else {
                status = "營業中";
                statusClass = "open";
            }
        } else {
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

        const badge = document.getElementById('statusBadge');
        if (badge) {
            badge.textContent = status;
            badge.className = 'status-badge ' + statusClass;
        }
        
        const noteEl = document.getElementById('statusNote');
        if (noteEl) {
            noteEl.textContent = note;
        }
    }

    updateLiveClock();
    setInterval(updateLiveClock, 1000);
});
