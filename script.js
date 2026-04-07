// ==========================================
// 【手動售完開關】
// 如果今天提早賣完，請將下面的 false 改成 true
// 隔天營業前，記得再用電腦把它改回 false 喔！
// ==========================================
const isSoldOut = false;


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
                document.querySelectorAll('#info-section .fade-in-up').forEach(el => el.classList.add('in-view'));
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
        threshold: 0, 
        rootMargin: "0px 0px 50px 0px" 
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
            if (!el.classList.contains('in-view') && (el.closest('.active') || el.closest('#info-section'))) {
                observer.observe(el);
            }
        });
    }

    triggerAnimations();

    // --- 季節菜單切換 ---
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonMenus = document.querySelectorAll('.season-menu');

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            seasonTabs.forEach(t => t.classList.remove('active'));
            seasonMenus.forEach(m => m.classList.remove('active'));

            tab.classList.add('active');
            const targetMenu = document.getElementById(tab.getAttribute('data-target'));
            
            if (targetMenu) {
                targetMenu.classList.add('active');
            }
        });
    });

    // --- 營業時間自動切換特效 (含週三特例與售完開關) ---
    function updateStoreStatus() {
        const statusBadge = document.getElementById('store-status-badge');
        const hoursText = document.querySelector('.store-hours-text');
        if (!statusBadge || !hoursText) return; 

        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 是週日, 3 是週三
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        const currentTimeInMinutes = hours * 60 + minutes;
        const openTime = 10 * 60; // 600 (早上 10:00)
        const closeTime = 21 * 60 + 30; // 1290 (晚上 09:30)
        const closingSoonTime = closeTime - 30; // 1260

        // 1. 最優先判斷：如果手動開啟了「已售完」
        if (isSoldOut) {
            statusBadge.textContent = '今日已售完';
            statusBadge.className = 'status-badge sold-out';
            return; // 已經售完，直接結束判斷
        }

        // 2. 判斷是否為星期三 (週三優惠日)
        if (dayOfWeek === 3) {
            hoursText.textContent = '營業時間 10:00am - 售完為止';
            
            if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
                statusBadge.textContent = '週三優惠熱銷中';
                statusBadge.className = 'status-badge promo'; // 觸發紅色呼吸燈
            } else {
                statusBadge.textContent = '休息中';
                statusBadge.className = 'status-badge closed';
            }
        } 
        // 3. 非星期三的一般日子
        else {
            hoursText.textContent = '營業時間 10:00am - 09:30pm';

            if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
                if (currentTimeInMinutes >= closingSoonTime) {
                    statusBadge.textContent = '即將休息';
                    statusBadge.className = 'status-badge closing-soon'; // 橘色呼吸燈
                } else {
                    statusBadge.textContent = '營業中';
                    statusBadge.className = 'status-badge open'; // 綠色呼吸燈
                }
            } else {
                statusBadge.textContent = '休息中';
                statusBadge.className = 'status-badge closed';
            }
        }
    }
    
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000);
});
