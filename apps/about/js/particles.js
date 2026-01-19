// ===================================
// 粒子背景系统
// ===================================

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * this.config.speed.max;
        this.vy = (Math.random() - 0.5) * this.config.speed.max;
        this.size = Math.random() * (this.config.size.max - this.config.size.min) + this.config.size.min;
        this.alpha = Math.random() * 0.5 + 0.3;
    }

    update(mouse) {
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.vy *= -1;
        }

        // 鼠标交互
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.config.mouseDistance) {
                const force = (this.config.mouseDistance - dist) / this.config.mouseDistance;
                const angle = Math.atan2(dy, dx);

                // 粒子被鼠标排斥
                this.vx -= Math.cos(angle) * force * 0.5;
                this.vy -= Math.sin(angle) * force * 0.5;
            }
        }

        // 速度限制
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.config.speed.max) {
            this.vx = (this.vx / speed) * this.config.speed.max;
            this.vy = (this.vy / speed) * this.config.speed.max;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.color.replace('0.6', this.alpha.toFixed(2));
        this.ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.animationId = null;

        // 根据设备类型选择配置
        const deviceType = DEVICE.isMobile() ? 'mobile' : DEVICE.isTablet() ? 'tablet' : 'desktop';

        this.config = {
            ...CONFIG.particles,
            count: CONFIG.particles.count[deviceType],
            connectDistance: CONFIG.particles.connectDistance[deviceType]
        };

        // 性能优化
        if (DEVICE.isReducedMotion() || !CONFIG.particles.enabled) {
            this.config.enabled = false;
            return;
        }

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();

        Debug.log('ParticleSystem initialized with', this.particles.length, 'particles');
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(
            this.config.count,
            CONFIG.performance.maxParticles
        );

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.canvas, this.config));
        }
    }

    bindEvents() {
        // 窗口大小改变
        window.addEventListener('resize', debounce(() => {
            this.resize();
            this.createParticles();
        }, 250));

        // 鼠标移动
        if (!DEVICE.isTouch()) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }

        // 触摸移动
        if (DEVICE.isTouch()) {
            window.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
            });

            window.addEventListener('touchend', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.config.connectDistance) {
                    const opacity = (1 - dist / this.config.connectDistance) * 0.5;
                    this.ctx.strokeStyle = this.config.lineColor.replace('0.3', opacity.toFixed(2));
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        if (!this.config.enabled) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });

        // 连接粒子
        this.connectParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
    }
}

// 鼠标轨迹粒子效果
class MouseTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = DEVICE.isMobile() ? 5 : 10;
        this.enabled = !DEVICE.isReducedMotion();

        if (this.enabled) {
            this.init();
        }
    }

    init() {
        if (DEVICE.isTouch()) return;

        document.addEventListener('mousemove', (e) => {
            this.addTrail(e.clientX, e.clientY);
        });

        this.animate();
    }

    addTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'particle-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.width = '20px';
        trail.style.height = '20px';
        document.body.appendChild(trail);

        this.trails.push(trail);

        // 移除旧的轨迹
        if (this.trails.length > this.maxTrails) {
            const oldTrail = this.trails.shift();
            oldTrail.remove();
        }

        // 自动移除当前轨迹
        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
            }
            const index = this.trails.indexOf(trail);
            if (index > -1) {
                this.trails.splice(index, 1);
            }
        }, 500);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子系统
let particleSystem;
let mouseTrail;

DOM.ready(() => {
    // 主粒子系统
    particleSystem = new ParticleSystem();

    // 鼠标轨迹效果
    mouseTrail = new MouseTrail();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, MouseTrail };
}
