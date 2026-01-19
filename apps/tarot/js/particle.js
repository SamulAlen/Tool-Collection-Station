// 魔法粒子系统
class MagicParticleSystem {
    constructor() {
        this.particles = [];
        this.emitters = new Map();
    }

    // 创建魔法粒子
    createParticle(x, y, options = {}) {
        const config = options.config || CONFIG.particles.magic;
        const colors = options.colors || config.colors;

        const particle = {
            x: x,
            y: y,
            size: randomRange(config.size.min, config.size.max),
            color: colors[randomInt(0, colors.length - 1)],
            vx: randomRange(-config.speed.max, config.speed.max),
            vy: randomRange(-config.speed.max, config.speed.max),
            life: 1,
            lifetime: randomRange(config.lifetime.min, config.lifetime.max),
            createdAt: Date.now(),
            type: options.type || 'magic',
            rotation: randomRange(0, Math.PI * 2),
            rotationSpeed: randomRange(-0.1, 0.1),
            gravity: options.gravity || 0.02
        };

        this.particles.push(particle);
        return particle;
    }

    // 创建粒子爆发
    burst(x, y, count = 20, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = randomRange(0, Math.PI * 2);
            const speed = randomRange(1, 4);

            const particle = this.createParticle(x, y, {
                ...options,
                gravity: options.gravity || 0.05
            });

            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
        }
    }

    // 创建粒子轨迹
    trail(x, y, options = {}) {
        if (Math.random() > 0.3) return; // 控制密度

        this.createParticle(x, y, {
            ...options,
            gravity: 0
        });
    }

    // 创建持续发射器
    createEmitter(id, x, y, options = {}) {
        const emitter = {
            id,
            x,
            y,
            rate: options.rate || 5, // 每秒发射数量
            lastEmit: 0,
            duration: options.duration || 2000,
            startTime: Date.now(),
            spread: options.spread || 50,
            direction: options.direction || 'up',
            particleOptions: options.particleOptions || {}
        };

        this.emitters.set(id, emitter);
        return emitter;
    }

    // 更新发射器
    updateEmitters() {
        const now = Date.now();

        for (const [id, emitter] of this.emitters) {
            // 检查是否过期
            if (now - emitter.startTime > emitter.duration) {
                this.emitters.delete(id);
                continue;
            }

            // 发射粒子
            const timeSinceLastEmit = now - emitter.lastEmit;
            const emitInterval = 1000 / emitter.rate;

            if (timeSinceLastEmit >= emitInterval) {
                const offsetX = randomRange(-emitter.spread, emitter.spread);
                const offsetY = randomRange(-emitter.spread, emitter.spread);

                let particleX = emitter.x + offsetX;
                let particleY = emitter.y + offsetY;
                let particleOptions = { ...emitter.particleOptions };

                // 根据方向设置初始速度
                if (emitter.direction === 'up') {
                    particleOptions.gravity = 0.03;
                } else if (emitter.direction === 'outward') {
                    const angle = Math.atan2(offsetY, offsetX);
                    const speed = randomRange(1, 3);
                    const particle = this.createParticle(particleX, particleY, particleOptions);
                    particle.vx = Math.cos(angle) * speed;
                    particle.vy = Math.sin(angle) * speed;
                    continue;
                }

                this.createParticle(particleX, particleY, particleOptions);
                emitter.lastEmit = now;
            }
        }
    }

    // 更新所有粒子
    update() {
        const now = Date.now();

        // 更新发射器
        this.updateEmitters();

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // 更新位置
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;

            // 更新旋转
            p.rotation += p.rotationSpeed;

            // 计算生命周期
            const age = now - p.createdAt;
            p.life = 1 - (age / p.lifetime);

            // 移除死亡粒子
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 渲染粒子
    render(ctx) {
        ctx.save();

        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            // 绘制星星形状的魔法粒子
            this.drawMagicStar(ctx, p);

            ctx.restore();
        }

        ctx.restore();
    }

    // 绘制魔法星星
    drawMagicStar(ctx, particle) {
        const size = particle.size;
        const spikes = 4;

        ctx.beginPath();
        ctx.fillStyle = particle.color;

        // 添加发光效果
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = size * 2;

        // 绘制四角星
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes - Math.PI / 4;
            const radius = i % 2 === 0 ? size : size / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();

        // 重置阴影
        ctx.shadowBlur = 0;
    }

    // 创建卡牌翻转特效
    createCardFlipEffect(x, y, width, height) {
        // 四角发光
        this.burst(x, y, 10, { colors: ['#FFD700', '#FFA500'] });
        this.burst(x + width, y, 10, { colors: ['#FFD700', '#FFA500'] });
        this.burst(x, y + height, 10, { colors: ['#FFD700', '#FFA500'] });
        this.burst(x + width, y + height, 10, { colors: ['#FFD700', '#FFA500'] });

        // 中间光环
        this.createEmitter('flip-ring-' + Date.now(), x + width/2, y + height/2, {
            rate: 30,
            duration: 500,
            spread: 5,
            direction: 'outward',
            particleOptions: {
                colors: ['#9D4EDD', '#C77DFF'],
                gravity: 0
            }
        });
    }

    // 创建洗牌特效
    createShuffleEffect(centerX, centerY) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const angle = randomRange(0, Math.PI * 2);
                const distance = randomRange(50, 150);
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                this.burst(x, y, 15);
            }, i * 100);
        }
    }

    // 清除所有粒子
    clear() {
        this.particles = [];
        this.emitters.clear();
    }

    // 清除特定发射器
    removeEmitter(id) {
        this.emitters.delete(id);
    }
}

// 导出到全局
window.MagicParticleSystem = MagicParticleSystem;
