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
        rootMargin: "0px 0px -20px 0px" // 微調手機版容易觸發
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

    // --- 季節菜單按鈕流暢切換 ---
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonMenus = document.querySelectorAll('.season-menu');

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. 關閉所有按鈕與菜單的顯示
            seasonTabs.forEach(t => t.classList.remove('active'));
            seasonMenus.forEach(m => m.classList.remove('active'));

            // 2. 啟動當前點擊的按鈕與目標菜單
            tab.classList.add('active');
            const targetMenu = document.getElementById(tab.getAttribute('data-target'));
            
            if (targetMenu) {
                targetMenu.classList.add('active');
                
                // 3. 重置動畫狀態，讓新出現的菜單再次浮現
                const newFades = targetMenu.querySelectorAll('.fade-in-up');
                newFades.forEach(el => {
                    el.classList.remove('in-view');
                    // 稍微延遲讓 DOM 渲染後再掛載監聽器
                    setTimeout(() => observer.observe(el), 50);
                });
            }
        });
    });
});
