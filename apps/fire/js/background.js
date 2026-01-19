// 背景星空系统
class StarField {
    constructor() {
        this.stars = [];
        this.initStars(CONFIG.BACKGROUND.STAR_COUNT);
    }

    // 初始化星星
    initStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight * 0.7,
                size: randomRange(CONFIG.BACKGROUND.STAR_MIN_SIZE, CONFIG.BACKGROUND.STAR_MAX_SIZE),
                speed: randomRange(CONFIG.BACKGROUND.STAR_MIN_SPEED, CONFIG.BACKGROUND.STAR_MAX_SPEED),
                opacity: randomRange(CONFIG.BACKGROUND.STAR_MIN_OPACITY, CONFIG.BACKGROUND.STAR_MAX_OPACITY),
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    // 更新星星位置
    update() {
        this.stars.forEach(star => {
            star.y -= star.speed;
            star.twinkle += 0.02;

            if (star.y < 0) {
                star.y = window.innerHeight;
                star.x = Math.random() * window.innerWidth;
            }
        });
    }

    // 渲染背景
    render(ctx, width, height, hideStars) {
        // 径向渐变背景 - 中心亮边缘暗的晕影效果（降低中心亮度）
        const maxDim = Math.max(width, height);
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, maxDim * 0.6
        );
        // 降低中心亮度
        gradient.addColorStop(0, '#151525');     // 中心亮度降低
        gradient.addColorStop(0.25, '#0f0f1a');  // 内圈过渡
        gradient.addColorStop(0.5, '#0a0a12');   // 中圈
        gradient.addColorStop(0.75, '#05050a');  // 外圈
        gradient.addColorStop(1, '#000000');     // 边缘纯黑

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 烟花绽放时隐藏星星
        if (hideStars) return;

        // 渲染星星
        this.stars.forEach(star => {
            // 闪烁效果 - 透明度在 50%-100% 之间波动
            const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            ctx.fill();

            // 添加微弱的光晕效果
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.2})`;
            ctx.fill();
        });
    }

    // 重置星星（窗口大小改变时）
    reset() {
        this.stars = [];
        this.initStars(CONFIG.BACKGROUND.STAR_COUNT);
    }
}
