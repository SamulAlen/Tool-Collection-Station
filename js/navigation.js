/**
 * 导航控制器
 * 负责处理导航切换、状态更新和路由管理
 */

class NavigationController {
    constructor(iframeController) {
        this.iframeController = iframeController;
        this.navItems = document.querySelectorAll('.nav-item');
        this.pageTitle = document.getElementById('pageTitle');

        if (!this.navItems.length) {
            console.error('Navigation items not found');
            return;
        }

        this.init();
    }

    /**
     * 初始化导航
     */
    init() {
        // 为每个导航项添加点击事件
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const appId = item.getAttribute('data-app');
                this.navigate(appId);
            });
        });

        // 监听浏览器前进/后退
        window.addEventListener('popstate', (e) => {
            const appId = e.state?.app || this.getAppFromHash() || APP_CONFIG.defaultApp;
            this.navigate(appId, false);
        });

        // 加载初始应用
        const initialApp = this.getAppFromHash() || APP_CONFIG.defaultApp;
        this.navigate(initialApp, false);

        console.log('NavigationController initialized');
    }

    /**
     * 导航到指定应用
     * @param {string} appId - 应用 ID
     * @param {boolean} updateHistory - 是否更新浏览器历史
     */
    navigate(appId, updateHistory = true) {
        const app = APP_CONFIG.apps[appId];
        if (!app) {
            console.warn(`App not found: ${appId}`);
            return;
        }

        // 更新导航状态
        this.updateNavState(appId);

        // 更新页面标题
        if (this.pageTitle) {
            this.pageTitle.textContent = app.name;
        }

        // 加载应用
        this.iframeController.loadApp(appId);

        // 更新浏览器历史
        if (updateHistory) {
            history.pushState({ app: appId }, '', `#${appId}`);
        }

        // 移动端：关闭侧边栏
        this.closeSidebarOnMobile();

        console.log(`Navigated to: ${app.name}`);
    }

    /**
     * 更新导航状态
     * @param {string} activeId - 激活的应用 ID
     */
    updateNavState(activeId) {
        this.navItems.forEach(item => {
            const appId = item.getAttribute('data-app');
            if (appId === activeId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * 从 URL hash 获取应用 ID
     * @returns {string|null}
     */
    getAppFromHash() {
        const hash = window.location.hash.slice(1);
        return APP_CONFIG.apps[hash] ? hash : null;
    }

    /**
     * 关闭移动端侧边栏
     */
    closeSidebarOnMobile() {
        if (window.innerWidth <= 1024) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const menuToggle = document.getElementById('menuToggle');

            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    }
}
