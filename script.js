document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideNav = document.getElementById('sideNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');

    // 開關側邊選單
    function toggleMenu() {
        menuToggle.classList.toggle('open');
        sideNav.classList.toggle('open');
        navOverlay.classList.toggle('open');
    }

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // 分頁切換邏輯
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // 如果點擊的是店家資訊，直接滾動到底部
            if (targetId === 'info-section') {
                toggleMenu();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                return;
            }

            // 1. 移除所有導覽列的 active 狀態
            navLinks.forEach(l => l.classList.remove('active'));
            // 2. 幫當前點擊的加上 active 狀態
            this.classList.add('active');

            // 3. 隱藏所有內容區塊
            pageSections.forEach(section => section.classList.remove('active'));
            // 4. 顯示目標區塊
            document.getElementById(targetId).classList.add('active');

            // 5. 關閉選單並回到網頁最上方
            toggleMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
