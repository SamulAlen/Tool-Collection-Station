/**
 * Iframe 控制器
 * 负责管理和加载子应用 iframe
 */

class IframeController {
    constructor() {
        this.frame = document.getElementById('appFrame');
        this.currentApp = null;

        if (!this.frame) {
            console.error('Iframe element not found');
            return;
        }

        // 监听 iframe 加载完成
        this.frame.addEventListener('load', () => {
            this.onFrameLoad();
        });
    }

    /**
     * 加载指定的应用
     * @param {string} appId - 应用 ID
     */
    loadApp(appId) {
        const app = APP_CONFIG.apps[appId];
        if (!app) {
            console.error(`App not found: ${appId}`);
            return;
        }

        // 检查是否需要重新加载
        const currentPath = this.frame.src;
        const fullPath = new URL(app.path, window.location.origin).href;

        if (this.currentApp !== appId || currentPath !== fullPath) {
            this.frame.src = app.path;
            this.currentApp = appId;
            console.log(`Loading app: ${app.name} (${app.path})`);
        }
    }

    /**
     * iframe 加载完成回调
     */
    onFrameLoad() {
        console.log(`Iframe loaded: ${this.currentApp}`);

        // 可以在这里添加 iframe 加载完成的处理逻辑
        // 例如：添加加载动画结束、发送初始化消息等
    }

    /**
     * 获取当前应用 ID
     * @returns {string|null}
     */
    getCurrentApp() {
        return this.currentApp;
    }

    /**
     * 重新加载当前应用
     */
    reload() {
        if (this.frame.src) {
            this.frame.src = this.frame.src;
        }
    }

    /**
     * 清空 iframe
     */
    clear() {
        this.frame.src = 'about:blank';
        this.currentApp = null;
    }
}
