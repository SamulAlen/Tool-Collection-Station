// 屏幕闪烁效果管理器
class ScreenFlash {
    constructor() {
        this.active = false;
        this.color = { r: 255, g: 255, b: 255 };
        this.opacity = 0;
        this.maxOpacity = CONFIG.SCREEN_FLASH.MAX_OPACITY;
        this.fadeInSpeed = CONFIG.SCREEN_FLASH.FADE_IN_SPEED;
        this.fadeOutSpeed = CONFIG.SCREEN_FLASH.FADE_OUT_SPEED;
    }

    // 触发闪烁
    trigger(color) {
        this.color = color;
        this.active = true;
        this.opacity = 0;
    }

    // 更新闪烁状态
    update() {
        if (this.active) {
            this.opacity += this.fadeInSpeed;
            if (this.opacity >= this.maxOpacity) {
                this.opacity = this.maxOpacity;
                this.active = false;
            }
        } else if (this.opacity > 0) {
            this.opacity -= this.fadeOutSpeed;
            if (this.opacity < 0) {
                this.opacity = 0;
            }
        }
    }

    // 渲染闪烁效果
    render(ctx, width, height) {
        if (this.opacity > 0) {
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fillRect(0, 0, width, height);
        }
    }

    // 检查是否正在闪烁
    isFlashing() {
        return this.active || this.opacity > 0;
    }
}
