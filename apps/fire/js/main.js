// 主程序
class FireworkShow {
    constructor() {
        this.renderer = null;
        this.starField = null;
        this.screenFlash = null;
        this.fireworks = [];
        this.autoMode = false;
        this.autoLaunchInterval = null;
        this.currentHue = 330;
        this.currentColor = colorFromHue(this.currentHue);
        this.randomColorMode = false;
        this.accumulatedFireworks = 0;
        this.maxAccumulated = 16;
        this.wasAutoMode = false;
        this.pageHideTime = null;

        this.init();
    }

    // 初始化
    init() {
        // 创建渲染器
        this.renderer = new CanvasRenderer();

        // 创建星空
        this.starField = new StarField();

        // 创建屏幕闪烁
        this.screenFlash = new ScreenFlash();

        // 暴露到全局
        window.starField = this.starField;
        window.screenFlash = this.screenFlash;

        // 初始化控制台
        this.initConsole();

        // 初始化页面可见性监听
        this.initVisibilityHandling();

        // 启动动画循环
        this.startAnimationLoop();
    }

    // 启动动画循环
    startAnimationLoop() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }

    // 更新状态
    update() {
        // 更新星星
        this.starField.update();

        // 更新烟花
        this.fireworks.forEach(fw => fw.update());

        // 移除已消失的烟花
        this.fireworks = this.fireworks.filter(fw => fw.isAlive());

        // 更新屏幕闪烁
        this.screenFlash.update();
    }

    // 渲染
    render() {
        // 背景始终显示（包括星星），不隐藏
        this.renderer.renderBackground(false);

        // 渲染烟花
        this.renderer.renderFireworks(this.fireworks);

        // 渲染覆盖层
        this.renderer.renderOverlay(this.screenFlash);
    }

    // 发射烟花
    launchFirework(type, x = null, targetY = null) {
        const size = this.renderer.getSize();
        const posX = x !== null ? x : randomRange(size.width * 0.15, size.width * 0.85);
        const posY = targetY !== null ? targetY : randomRange(size.height * 0.15, size.height * 0.4);

        const color = this.randomColorMode ? randomColor() : this.currentColor;

        const firework = new Firework(type, color, posX, posY, size.height);
        this.fireworks.push(firework);
    }

    // 发射随机烟花（随机类型和颜色）
    launchRandomFirework(x, targetY) {
        const types = CONFIG.FIREWORK_TYPES;
        const type = types[randomInt(0, types.length - 1)];
        const color = randomColor();

        const firework = new Firework(type, color, x, targetY, this.renderer.getSize().height);
        this.fireworks.push(firework);
    }

    // 氛围发射（16个烟花）
    launchAtmosphereSequence() {
        const types = CONFIG.FIREWORK_TYPES;

        for (let i = 0; i < 16; i++) {
            setTimeout(() => {
                const type = types[randomInt(0, types.length - 1)];
                this.launchFirework(type);
            }, i * 150);
        }
    }

    // 切换自动模式
    toggleAutoMode() {
        this.autoMode = !this.autoMode;

        if (this.autoLaunchInterval) {
            clearInterval(this.autoLaunchInterval);
            this.autoLaunchInterval = null;
        }

        if (this.autoMode) {
            this.autoLaunchInterval = setInterval(() => {
                const types = CONFIG.FIREWORK_TYPES;
                const type = types[randomInt(0, types.length - 1)];
                this.launchFirework(type);
            }, CONFIG.FIREWORK.AUTO_LAUNCH_INTERVAL);
        }

        this.updatePlayButton();
    }

    // 更新播放按钮状态
    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        const playText = playBtn.querySelector('.btn-text');
        const statusText = document.getElementById('console-status');

        if (this.autoMode) {
            playBtn.classList.add('playing');
            playText.textContent = '自动';
            statusText.textContent = 'Auto Sequence Running';
        } else {
            playBtn.classList.remove('playing');
            playText.textContent = '手动';
            statusText.textContent = 'Ready to Launch';
        }
    }

    // 切换颜色模式
    toggleColorMode() {
        this.randomColorMode = !this.randomColorMode;

        const colorModeText = document.getElementById('color-mode-text');
        const colorPreview = document.getElementById('color-preview');
        const rainbowIcon = document.querySelector('.rainbow-icon');

        if (this.randomColorMode) {
            colorModeText.textContent = '随机中';
            colorModeText.classList.add('random');
            colorPreview.style.display = 'none';
            rainbowIcon.style.display = 'block';
        } else {
            colorModeText.textContent = '固定模式';
            colorModeText.classList.remove('random');
            colorPreview.style.display = 'block';
            rainbowIcon.style.display = 'none';
        }
    }

    // 更新颜色预览
    updateColorPreview() {
        const colorPreview = document.getElementById('color-preview');
        colorPreview.style.backgroundColor = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
    }

    // 初始化页面可见性处理
    initVisibilityHandling() {
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时
                this.handlePageHide();
            } else {
                // 页面显示时
                this.handlePageShow();
            }
        });
    }

    // 页面隐藏处理
    handlePageHide() {
        // 如果处于自动模式，记录隐藏时间
        if (this.autoMode) {
            this.wasAutoMode = true;
            this.pageHideTime = Date.now();
        } else {
            this.wasAutoMode = false;
            this.pageHideTime = null;
        }
    }

    // 页面显示处理
    handlePageShow() {
        // 如果之前是自动模式且记录了隐藏时间
        if (this.wasAutoMode && this.pageHideTime) {
            // 计算隐藏时长（秒）
            const hiddenDuration = (Date.now() - this.pageHideTime) / 1000;
            const intervalInSeconds = CONFIG.FIREWORK.AUTO_LAUNCH_INTERVAL / 1000;

            // 计算应该发射的烟花数量
            this.accumulatedFireworks = Math.min(
                Math.floor(hiddenDuration / intervalInSeconds),
                this.maxAccumulated
            );

            // 如果有累计的烟花，一齐发射
            if (this.accumulatedFireworks > 0) {
                this.launchAccumulatedFireworks();
            }

            this.pageHideTime = null;
        }
    }

    // 发射累计的烟花
    launchAccumulatedFireworks() {
        const types = CONFIG.FIREWORK_TYPES;
        const count = this.accumulatedFireworks;

        for (let i = 0; i < count; i++) {
            // 延迟发射，制造连续效果
            setTimeout(() => {
                const type = types[randomInt(0, types.length - 1)];
                this.launchFirework(type);
            }, i * 100);
        }

        // 清空累计
        this.accumulatedFireworks = 0;
    }

    // 初始化控制台
    initConsole() {
        const consoleEl = document.getElementById('firework-console');
        const collapseBtn = document.getElementById('collapse-btn');
        const openBtn = document.getElementById('open-console');
        const playBtn = document.getElementById('play-btn');
        const atmosphereBtn = document.getElementById('atmosphere-launch');
        const colorModeText = document.getElementById('color-mode-text');
        const hueSlider = document.getElementById('hue-slider');
        const fireworkTypeBtns = document.querySelectorAll('.firework-type-btn');

        // 初始化颜色预览
        this.updateColorPreview();
        // 初始化播放按钮状态
        this.updatePlayButton();

        // 折叠控制台
        collapseBtn.addEventListener('click', () => {
            consoleEl.classList.remove('visible');
            consoleEl.classList.add('hidden');
            openBtn.classList.remove('hidden');
        });

        // 鼠标悬浮显示按钮
        openBtn.addEventListener('mouseenter', () => {
            if (consoleEl.classList.contains('hidden')) {
                openBtn.classList.add('visible');
            }
        });

        openBtn.addEventListener('mouseleave', () => {
            openBtn.classList.remove('visible');
        });

        // 打开控制台
        openBtn.addEventListener('click', () => {
            consoleEl.classList.remove('hidden');
            consoleEl.classList.add('visible');
            openBtn.classList.remove('visible');
            openBtn.classList.add('hidden');
        });

        // 播放/暂停按钮
        playBtn.addEventListener('click', () => {
            this.toggleAutoMode();
        });

        // 氛围发射按钮
        atmosphereBtn.addEventListener('click', () => {
            this.launchAtmosphereSequence();
        });

        // 颜色模式切换
        colorModeText.addEventListener('click', () => {
            this.toggleColorMode();
        });

        // 色相滑块
        hueSlider.addEventListener('input', (e) => {
            this.currentHue = parseInt(e.target.value);
            this.currentColor = colorFromHue(this.currentHue);
            this.updateColorPreview();

            // 如果在随机模式下拖动，切换回固定模式
            if (this.randomColorMode) {
                this.toggleColorMode();
            }
        });

        // 烟花类型按钮
        fireworkTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = btn.dataset.type;
                this.launchFirework(type);
            });
        });

        // 点击画布发射随机烟花
        document.getElementById('fw-canvas').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const targetY = e.clientY - rect.top;

            // 只在控制台区域外点击才发射
            if (!e.target.closest('.firework-console')) {
                this.launchRandomFirework(x, targetY);
            }
        });

        // 点击overlay canvas也发射
        document.getElementById('overlay-canvas').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const targetY = e.clientY - rect.top;

            if (!e.target.closest('.firework-console')) {
                this.launchRandomFirework(x, targetY);
            }
        });
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    window.fireworkShow = new FireworkShow();
});
