// 烟花类
class Firework {
    constructor(type, color, x, targetY, canvasHeight) {
        this.type = type;
        this.color = color;
        this.x = x;
        this.startY = canvasHeight;
        this.y = canvasHeight;
        this.targetY = targetY;
        this.vy = this.calculateInitialVelocity(targetY, canvasHeight);
        this.vx = 0;
        this.phase = 'ascending';
        this.particles = [];
        this.trail = [];
        this.exploded = false;
        this.particleCount = CONFIG.FIREWORK.PARTICLE_COUNT;
    }

    // 计算初速度（负值表示向上）
    calculateInitialVelocity(targetY, canvasHeight) {
        const g = CONFIG.FIREWORK.GRAVITY;
        const s = canvasHeight - targetY;
        return -Math.sqrt(2 * g * s);
    }

    // 更新烟花状态
    update() {
        if (this.phase === 'ascending') {
            this.updateAscent();
        } else if (this.phase === 'exploding') {
            this.updateParticles();
        }
    }

    // 更新上升阶段
    updateAscent() {
        // 记录拖尾
        this.trail.push({ x: this.x, y: this.y, opacity: 1 });
        if (this.trail.length > CONFIG.FIREWORK.TRAIL_LENGTH) {
            this.trail.shift();
        }

        // 更新拖尾透明度
        this.trail.forEach((t, i) => {
            t.opacity = i / this.trail.length;
        });

        // 物理运动
        this.vy += CONFIG.FIREWORK.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // 检查是否到达顶点
        if (this.vy >= 0) {
            this.explode();
        }
    }

    // 爆炸
    explode() {
        this.phase = 'exploding';
        this.exploded = true;

        // 根据类型生成粒子
        const particleData = getFireworkParticles(
            this.type,
            this.x,
            this.y,
            this.color,
            this.particleCount
        );

        // 创建粒子对象
        this.particles = particleData.map(p =>
            new Particle(p.x, p.y, p.vx, p.vy, this.color, p.life)
        );

        // 触发屏幕闪烁
        if (window.screenFlash) {
            window.screenFlash.trigger(this.color);
        }
    }

    // 更新粒子
    updateParticles() {
        this.particles.forEach(p => p.update());

        // 移除死亡粒子
        this.particles = this.particles.filter(p => p.isAlive());

        // 检查是否所有粒子都消失
        if (this.particles.length === 0) {
            this.phase = 'faded';
        }
    }

    // 渲染烟花
    render(ctx) {
        if (this.phase === 'ascending') {
            this.renderAscent(ctx);
        } else if (this.phase === 'exploding') {
            this.renderParticles(ctx);
        }
    }

    // 渲染上升阶段
    renderAscent(ctx) {
        // 渲染拖尾 - 增加亮度
        this.trail.forEach(t => {
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${t.opacity * 0.7})`;
            ctx.fillRect(t.x - 1.5, t.y - 1.5, 3, 3);
        });

        // 设置超强的光芒效果
        ctx.shadowBlur = 25;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;

        // 渲染弹头 - 更亮
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fillRect(this.x - 2.5, this.y - 2.5, 5, 5);

        // 白色高光核心 - 大而明亮
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 255, 255, 1)`;
        ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        ctx.fillRect(this.x - 1.5, this.y - 1.5, 3, 3);

        // 重置阴影效果
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    // 渲染粒子
    renderParticles(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }

    // 检查烟花是否存活
    isAlive() {
        return this.phase !== 'faded';
    }

    // 检查是否已爆炸
    hasExploded() {
        return this.exploded;
    }
}
