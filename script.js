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
                // 修正 1：點擊「店家資訊」時，強制讓底部資訊直接浮現
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

    // --- Fade-in up 動畫監聽 (修正版) ---
    const observerOptions = {
        threshold: 0, /* 修正 1：將門檻調降為 0，只要邊緣碰到就會觸發，避免手機版高度計算失誤 */
        rootMargin: "0px 0px 50px 0px" /* 修正 1：向下延伸 50px 範圍，確保絕對能被偵測到 */
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
            // 包含 footer 區塊也能順利掛載動畫監聽
            if (!el.classList.contains('in-view') && (el.closest('.active') || el.closest('#info-section'))) {
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
            seasonTabs.forEach(t => t.classList.remove('active'));
            seasonMenus.forEach(m => m.classList.remove('active'));

            tab.classList.add('active');
            const targetMenu = document.getElementById(tab.getAttribute('data-target'));
            
            if (targetMenu) {
                targetMenu.classList.add('active');
                
                const newFades = targetMenu.querySelectorAll('.fade-in-up');
                newFades.forEach(el => {
                    el.classList.remove('in-view');
                    setTimeout(() => observer.observe(el), 50);
                });
            }
        });
    });
});
