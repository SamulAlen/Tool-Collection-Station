/**
 * 工具集合站主入口
 * 初始化应用并处理全局事件
 */

class App {
    constructor() {
        this.iframeController = null;
        this.navigationController = null;
        this.dragReorderController = null;
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 初始化 iframe 控制器
        this.iframeController = new IframeController();

        // 初始化导航控制器
        this.navigationController = new NavigationController(this.iframeController);

        // 初始化拖拽排序控制器
        this.dragReorderController = new DragReorderController();

        // 初始化移动端菜单
        this.initMobileMenu();

        // 初始化键盘快捷键
        this.initKeyboardShortcuts();

        console.log('App initialized successfully');
    }

    /**
     * 初始化移动端菜单
     */
    initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!menuToggle || !sidebar || !overlay) {
            return;
        }

        // 汉堡菜单点击事件
        menuToggle.addEventListener('click', () => {
            const isActive = sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // 遮罩层点击事件
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
        });

        // 点击导航项后关闭侧边栏（由 NavigationController 处理）
    }

    /**
     * 初始化键盘快捷键
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + M: 切换移动端菜单
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const menuToggle = document.getElementById('menuToggle');
                if (menuToggle && window.innerWidth <= 1024) {
                    menuToggle.click();
                }
            }

            // Alt + 1-4: 快速切换到对应应用
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const appMap = ['1', '2', '3', '4'];
                const appIdMap = {
                    '1': 'converter',
                    '2': 'timer',
                    '3': 'game',
                    '4': 'about'
                };
                const appId = appIdMap[e.key];
                if (appId && this.navigationController) {
                    this.navigationController.navigate(appId);
                }
            }
        });
    }
}

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// 处理页面卸载
window.addEventListener('beforeunload', () => {
    console.log('App is unloading');
});
