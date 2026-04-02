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
            
            // 切換分頁時，重新觸發該頁面的動畫
            setTimeout(triggerAnimations, 100); 
        });
    });

    // --- 新增：導航列捲動毛玻璃效果 ---
    const topNavBar = document.getElementById('topNavBar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topNavBar.classList.add('scrolled');
        } else {
            topNavBar.classList.remove('scrolled');
        }
    });

    // --- 新增：Fade-in up 捲動浮現動畫 ---
    const observerOptions = {
        threshold: 0.1, // 元素出現 10% 就觸發
        rootMargin: "0px 0px -50px 0px" // 稍微提早觸發
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // 動畫只播放一次
            }
        });
    }, observerOptions);

    function triggerAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => {
            // 如果元素還沒被加上 in-view，就開始監聽
            if (!el.classList.contains('in-view')) {
                observer.observe(el);
            }
        });
    }

    // 初始執行一次動畫監聽
    triggerAnimations();
});
