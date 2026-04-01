document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 導覽列平滑捲動 (扣除固定導覽列的高度，避免標題被遮擋)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. 滾動淡入動畫
    const animateElements = document.querySelectorAll('.menu-category, .section-title, .promo-banner, .info-grid');
    animateElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // 3. 回到頂部按鈕邏輯
    const backToTopBtn = document.createElement('a');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.href = '#top';
    backToTopBtn.innerHTML = '↑'; 
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
