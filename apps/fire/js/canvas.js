// Canvas渲染器
class CanvasRenderer {
    constructor() {
        // 背景层
        this.bgCanvas = document.getElementById('bg-canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');

        // 烟花层
        this.fwCanvas = document.getElementById('fw-canvas');
        this.fwCtx = this.fwCanvas.getContext('2d');

        // 覆盖层（屏幕闪烁）
        this.overlayCanvas = document.getElementById('overlay-canvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    // 调整画布大小
    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        [this.bgCanvas, this.fwCanvas, this.overlayCanvas].forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });

        this.width = width;
        this.height = height;

        // 重置星星
        if (window.starField) {
            window.starField.reset();
        }
    }

    // 渲染背景
    renderBackground(hideStars) {
        window.starField.render(this.bgCtx, this.width, this.height, hideStars);
    }

    // 渲染烟花
    renderFireworks(fireworks) {
        // 清除画布（完全清除以保持透明，不遮挡背景）
        this.fwCtx.clearRect(0, 0, this.width, this.height);

        // 渲染所有烟花
        fireworks.forEach(fw => fw.render(this.fwCtx));
    }

    // 渲染覆盖层（屏幕闪烁）
    renderOverlay(screenFlash) {
        this.overlayCtx.clearRect(0, 0, this.width, this.height);
        screenFlash.render(this.overlayCtx, this.width, this.height);
    }

    // 获取画布尺寸
    getSize() {
        return { width: this.width, height: this.height };
    }
}
