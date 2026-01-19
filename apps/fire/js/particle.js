// 粒子类
class Particle {
    constructor(x, y, vx, vy, color, life, parentColor = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.parentColor = parentColor || color;
        this.life = life || randomRange(35, 50);
        this.maxLife = this.life;
        this.alive = true;
        this.size = randomRange(CONFIG.PARTICLE.MIN_SIZE, CONFIG.PARTICLE.MAX_SIZE);
        this.trail = [];
        this.trailLength = CONFIG.PARTICLE.TRAIL_LENGTH;
        this.hasSplit = false;
        this.splitDelay = 25; // 绽放后25帧（约0.25秒）分裂
    }

    // 更新粒子状态
    update() {
        // 记录拖尾位置
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.vy += CONFIG.PARTICLE.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.age++;

        // 分裂逻辑：绽放后0.25秒（25帧）且未分裂过
        if (this.age >= this.splitDelay && !this.hasSplit) {
            this.hasSplit = true;
            return this.split();
        }

        if (this.life <= 0) {
            this.alive = false;
        }
        return null;
    }

    // 分裂成更小的彩色粒子
    split() {
        const splitParticles = [];
        const splitCount = 2; // 分裂2个粒子
        const newLife = randomRange(18, 25); // 子粒子生命约为父粒子的一半

        for (let i = 0; i < splitCount; i++) {
            // 子粒子向随机方向扩散
            const angle = (Math.PI * 2 / splitCount) * i + randomRange(-0.5, 0.5);
            const speed = randomRange(0.8, 1.5);
            const newVx = Math.cos(angle) * speed;
            const newVy = Math.sin(angle) * speed - 0.5;

            // 子粒子使用完全随机的彩色
            const newColor = randomColor();

            const newParticle = new Particle(this.x, this.y, newVx, newVy, newColor, newLife, newColor);
            newParticle.hasSplit = true; // 子粒子不再分裂
            splitParticles.push(newParticle);
        }

        return splitParticles;
    }

    // 渲染粒子（像素风格带拖尾和明亮光圈）
    render(ctx) {
        const opacity = this.life / this.maxLife;

        // 渲染拖尾 - 增加亮度
        this.trail.forEach((pos, i) => {
            const trailOpacity = opacity * (i / this.trail.length) * 0.7;
            const trailSize = this.size * (i / this.trail.length);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${trailOpacity})`;
            ctx.fillRect(pos.x - trailSize / 2, pos.y - trailSize / 2, trailSize, trailSize);
        });

        // 粒子本体 - 超强光圈效果
        ctx.shadowBlur = this.size * 8;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;

        // 渲染粒子本体 - 更亮
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.min(1, opacity * 2)})`;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // 白色高光核心 - 大而明亮
        const coreSize = this.size * 0.8;
        ctx.shadowBlur = coreSize * 3;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        ctx.fillRect(this.x - coreSize / 2, this.y - coreSize / 2, coreSize, coreSize);

        // 重置阴影效果
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    // 检查粒子是否存活
    isAlive() {
        return this.alive;
    }
}

// 粒子对象池（优化性能）
class ParticlePool {
    constructor(size) {
        this.pool = [];
        this.activeParticles = [];

        for (let i = 0; i < size; i++) {
            this.pool.push(new Particle(0, 0, 0, 0, { r: 0, g: 0, b: 0 }, 0));
        }
    }

    // 获取粒子
    get(x, y, vx, vy, color, life, parentColor = null) {
        let particle;

        if (this.pool.length > 0) {
            particle = this.pool.pop();
            particle.x = x;
            particle.y = y;
            particle.vx = vx;
            particle.vy = vy;
            particle.color = color;
            particle.parentColor = parentColor || color;
            particle.life = life;
            particle.maxLife = life;
            particle.alive = true;
            particle.size = randomRange(CONFIG.PARTICLE.MIN_SIZE, CONFIG.PARTICLE.MAX_SIZE);
            particle.trail = [];
            particle.trailLength = CONFIG.PARTICLE.TRAIL_LENGTH;
            particle.hasSplit = false;
            particle.age = 0;
        } else {
            particle = new Particle(x, y, vx, vy, color, life, parentColor);
        }

        this.activeParticles.push(particle);
        return particle;
    }

    // 释放粒子
    release(particle) {
        const index = this.activeParticles.indexOf(particle);
        if (index > -1) {
            this.activeParticles.splice(index, 1);
            this.pool.push(particle);
        }
    }

    // 更新所有活跃粒子
    update() {
        const newParticles = [];

        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            const splitResult = particle.update();

            // 如果粒子分裂了，添加新粒子到列表
            if (splitResult && Array.isArray(splitResult)) {
                newParticles.push(...splitResult);
            }

            if (!particle.alive) {
                this.release(particle);
            }
        }

        // 添加新粒子到活跃列表
        newParticles.forEach(p => this.activeParticles.push(p));
    }

    // 渲染所有活跃粒子
    render(ctx) {
        this.activeParticles.forEach(particle => particle.render(ctx));
    }

    // 获取活跃粒子数量
    getActiveCount() {
        return this.activeParticles.length;
    }
}
