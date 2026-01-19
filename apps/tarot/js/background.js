// 背景星空系统 - 适配塔罗主题
class StarField {
    constructor() {
        this.stars = [];
        this.initStars();
    }

    // 初始化星星
    initStars() {
        const count = CONFIG.particles.stars.count;
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: randomRange(
                    CONFIG.particles.stars.size.min,
                    CONFIG.particles.stars.size.max
                ),
                speed: randomRange(0.1, 0.5),
                opacity: randomRange(0.3, 1),
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: randomRange(0.02, 0.05)
            });
        }
    }

    // 更新星星位置
    update() {
        this.stars.forEach(star => {
            star.y -= star.speed;
            star.twinkle += star.twinkleSpeed;

            // 星星移出屏幕后重置
            if (star.y < -10) {
                star.y = window.innerHeight + 10;
                star.x = Math.random() * window.innerWidth;
            }
        });
    }

    // 渲染背景
    render(ctx, width, height) {
        // 创建深紫到黑色的渐变背景
        const maxDim = Math.max(width, height);
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, maxDim * 0.7
        );

        // 塔罗风格的深紫色调
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.3, '#12081f');
        gradient.addColorStop(0.6, '#0d0515');
        gradient.addColorStop(0.85, '#07030a');
        gradient.addColorStop(1, '#000000');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 渲染星星
        this.stars.forEach(star => {
            // 闪烁效果
            const twinkleOpacity = star.opacity * (0.4 + 0.6 * Math.sin(star.twinkle));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            ctx.fill();

            // 为较大的星星添加光晕
            if (star.size > 2) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(157, 78, 221, ${twinkleOpacity * 0.15})`;
                ctx.fill();
            }
        });
    }

    // 重置星星（窗口大小改变时）
    reset() {
        this.stars = [];
        this.initStars();
    }
}

// 导出到全局
window.StarField = StarField;
