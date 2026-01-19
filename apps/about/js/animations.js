// ===================================
// 滚动动画系统
// ===================================

class ScrollAnimations {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.enabled = CONFIG.animations.enabled && !DEVICE.isReducedMotion();

        if (this.enabled) {
            this.init();
        }
    }

    init() {
        this.observeElements();
        this.initNumberCounters();
        this.initTypewriter();
        this.initScrollProgress();

        Debug.log('ScrollAnimations initialized');
    }

    observeElements() {
        const options = {
            threshold: CONFIG.animations.threshold,
            rootMargin: CONFIG.animations.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);

                    // 只触发一次的动画
                    if (!entry.target.classList.contains('repeat-animation')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);

        this.observers.push(observer);

        // 观察所有带有动画类的元素
        const animatedElements = document.querySelectorAll(
            '.fade-up, .scale-up, .slide-left, .slide-right, .zoom-fade, .rotate-fade'
        );

        animatedElements.forEach(el => {
            // 为元素添加动画状态
            if (!el.classList.contains('animated')) {
                observer.observe(el);
                el.classList.add('animated');
            }
        });

        // 观察序列动画
        document.querySelectorAll('.stagger').forEach(container => {
            observer.observe(container);
        });
    }

    animateElement(element) {
        // 添加动画类
        element.classList.add('animate-in');

        // 处理序列动画
        if (element.classList.contains('stagger')) {
            const children = element.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        // 触发进度条动画
        const progressBars = element.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.getPropertyValue('--progress');
            if (width) {
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });

        // 触发技能进度条
        const skillProgress = element.querySelectorAll('.skill-progress');
        skillProgress.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    }

    initNumberCounters() {
        if (!CONFIG.counter.enabled) return;

        const counterElements = document.querySelectorAll('.stat-number[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => observer.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = CONFIG.counter.duration;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数
            const easedProgress = easingFunctions.easeOutQuad(progress);
            const currentValue = Math.floor(easedProgress * (target - startValue) + startValue);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }

    initTypewriter() {
        if (!CONFIG.typewriter.enabled) return;

        const container = document.querySelector('.hero-typewriter');
        if (!container) return;

        const texts = CONFIG.typewriter.texts;
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const type = () => {
            const currentText = texts[textIndex];

            if (isPaused) {
                setTimeout(type, CONFIG.typewriter.pauseDuration);
                isPaused = false;
                return;
            }

            if (isDeleting) {
                container.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                container.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            // 添加光标效果
            container.innerHTML += '<span class="typewriter-cursor"></span>';

            let typeSpeed = isDeleting
                ? CONFIG.typewriter.deletingSpeed
                : CONFIG.typewriter.typingSpeed;

            // 添加随机延迟使打字更自然
            typeSpeed += Math.random() * 50;

            if (!isDeleting && charIndex === currentText.length) {
                // 完成打字，暂停
                isPaused = true;
                typeSpeed = CONFIG.typewriter.pauseDuration;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // 完成删除，切换到下一个文本
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }

            setTimeout(type, typeSpeed);
        };

        // 延迟启动
        setTimeout(type, 1000);
    }

    initScrollProgress() {
        // 创建滚动进度指示器
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-indicator-line';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);

        // 更新滚动进度
        const updateProgress = throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }, 50);

        window.addEventListener('scroll', updateProgress);
    }

    // 视差滚动效果
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (parallaxElements.length === 0) return;

        const updateParallax = throttle(() => {
            const scrollTop = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, 50);

        window.addEventListener('scroll', updateParallax);
    }

    // 添加新的动画元素
    observeNewElement(element) {
        if (!this.enabled) return;

        const options = {
            threshold: CONFIG.animations.threshold,
            rootMargin: CONFIG.animations.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);

                    if (!entry.target.classList.contains('repeat-animation')) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);

        observer.observe(element);
        this.observers.push(observer);
    }

    // 重置所有动画
    reset() {
        this.animatedElements.clear();
        document.querySelectorAll('.animate-in').forEach(el => {
            el.classList.remove('animate-in');
        });
        this.observeElements();
    }

    // 销毁所有观察器
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
    }
}

// 悬停效果增强
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initTiltEffect();
        this.initMagneticEffect();
        this.initGlowEffect();
    }

    // 3D 倾斜效果
    initTiltEffect() {
        const tiltElements = document.querySelectorAll('.card-3d');

        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // 磁性按钮效果
    initMagneticEffect() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // 发光效果
    initGlowEffect() {
        const glowElements = document.querySelectorAll('.glow');

        glowElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.boxShadow = '0 0 40px rgba(102, 126, 234, 0.8)';
            });

            el.addEventListener('mouseleave', () => {
                el.style.boxShadow = '';
            });
        });
    }
}

// 页面加载动画
class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载时淡入
        document.body.style.opacity = '0';

        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';

            // 触发首屏动画
            setTimeout(() => {
                this.animateFirstScreen();
            }, 300);
        });
    }

    animateFirstScreen() {
        const heroElements = document.querySelectorAll('.hero-content > *');

        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';

            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// 初始化
let scrollAnimations;
let hoverEffects;
let pageLoader;

DOM.ready(() => {
    scrollAnimations = new ScrollAnimations();
    hoverEffects = new HoverEffects();
    pageLoader = new PageLoader();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollAnimations, HoverEffects, PageLoader };
}
