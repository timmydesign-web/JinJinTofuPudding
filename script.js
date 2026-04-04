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

    // --- 修正：季節菜單強制載入顯示 ---
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonMenus = document.querySelectorAll('.season-menu');

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 關閉所有選單狀態
            seasonTabs.forEach(t => t.classList.remove('active'));
            seasonMenus.forEach(m => m.classList.remove('active'));

            // 啟動點擊的選單
            tab.classList.add('active');
            const targetMenu = document.getElementById(tab.getAttribute('data-target'));
            
            if (targetMenu) {
                targetMenu.classList.add('active');
                
                // 強制將新菜單內的動畫元素加上顯示狀態，解決切換空白的 BUG
                const newFades = targetMenu.querySelectorAll('.fade-in-up');
                newFades.forEach(el => el.classList.remove('in-view'));
                setTimeout(() => {
                    newFades.forEach(el => el.classList.add('in-view'));
                }, 50);
            }
        });
    });

    // --- 營業時間自動切換特效 ---
    function updateStoreStatus() {
        const statusBadge = document.getElementById('store-status-badge');
        if (!statusBadge) return; 

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        const currentTimeInMinutes = hours * 60 + minutes;
        const openTime = 10 * 60;
        const closeTime = 21 * 60 + 30;

        if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
            statusBadge.textContent = '營業中';
            statusBadge.className = 'status-badge open';
        } else {
            statusBadge.textContent = '休息中';
            statusBadge.className = 'status-badge closed';
        }
    }
    
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000);
});
