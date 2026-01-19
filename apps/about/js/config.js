// ===================================
// 全局配置文件
// ===================================

const CONFIG = {
    // 网站信息
    site: {
        name: '你的名字',
        title: '高级软件开发工程师',
        description: '5年+全栈开发经验，精通React、Node.js等技术栈',
        email: 'your.email@example.com',
        phone: '+86 138-0000-0000',
        location: '中国·北京'
    },

    // 社交链接
    social: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername',
        email: 'mailto:your.email@example.com'
    },

    // 粒子系统配置
    particles: {
        enabled: true,
        count: {
            desktop: 100,
            tablet: 60,
            mobile: 30
        },
        size: {
            min: 1,
            max: 3
        },
        speed: {
            min: 0.2,
            max: 0.8
        },
        connectDistance: {
            desktop: 150,
            tablet: 120,
            mobile: 80
        },
        mouseDistance: 200,
        color: 'rgba(102, 126, 234, 0.6)',
        lineColor: 'rgba(102, 126, 234, 0.3)'
    },

    // 动画配置
    animations: {
        enabled: true,
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        },
        threshold: 0.1, // IntersectionObserver 阈值
        rootMargin: '0px 0px -100px 0px',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },

    // 打字机效果配置
    typewriter: {
        enabled: true,
        texts: [
            '全栈开发工程师',
            'React 专家',
            'Node.js 开发者',
            'UI/UX 爱好者'
        ],
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseDuration: 2000,
        loop: true
    },

    // 导航配置
    navigation: {
        smoothScroll: true,
        smoothScrollDuration: 800,
        highlightOnScroll: true,
        offset: 100
    },

    // 响应式断点
    breakpoints: {
        mobile: 480,
        tablet: 768,
        laptop: 992,
        desktop: 1200,
        wide: 1400
    },

    // 数字计数动画配置
    counter: {
        enabled: true,
        duration: 2000,
        easing: 'easeOutQuad'
    },

    // 表单配置
    form: {
        validation: true,
        showNotification: true,
        notificationDuration: 3000
    },

    // 性能优化配置
    performance: {
        lazyLoadImages: true,
        debounceDelay: 100,
        throttleDelay: 50,
        maxParticles: 150
    },

    // SEO 配置
    seo: {
        openGraph: true,
        twitterCard: true,
        structuredData: true
    },

    // 主题配置
    theme: {
        darkMode: false,
        autoSwitch: false
    },

    // 调试模式
    debug: false
};

// 设备检测
const DEVICE = {
    isMobile: () => window.innerWidth < CONFIG.breakpoints.mobile,
    isTablet: () => window.innerWidth >= CONFIG.breakpoints.mobile && window.innerWidth < CONFIG.breakpoints.tablet,
    isDesktop: () => window.innerWidth >= CONFIG.breakpoints.tablet,
    isTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isDarkMode: () => window.matchMedia('(prefers-color-scheme: dark)').matches
};

// 性能监控
const Performance = {
    enabled: CONFIG.debug,

    measure(name, fn) {
        if (!this.enabled) return fn();

        const start = performance.now();
        const result = fn();
        const end = performance.now();

        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    },

    mark(name) {
        if (this.enabled) {
            performance.mark(name);
        }
    }
};

// 调试日志
const Debug = {
    enabled: CONFIG.debug,

    log(...args) {
        if (this.enabled) {
            console.log('[Debug]', ...args);
        }
    },

    error(...args) {
        if (this.enabled) {
            console.error('[Debug]', ...args);
        }
    },

    warn(...args) {
        if (this.enabled) {
            console.warn('[Debug]', ...args);
        }
    }
};

// 本地存储辅助函数
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            Debug.error('Storage set error:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            Debug.error('Storage get error:', e);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            Debug.error('Storage remove error:', e);
            return false;
        }
    }
};

// URL 辅助函数
const URLHelper = {
    getParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    },

    setParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },

    removeParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }
};

// DOM 辅助函数
const DOM = {
    ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    },

    on(element, event, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = null;
        }

        if (selector) {
            element.addEventListener(event, (e) => {
                if (e.target.matches(selector)) {
                    handler.call(e.target, e);
                }
            });
        } else {
            element.addEventListener(event, handler);
        }
    },

    delegate(element, event, selector, handler) {
        element.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target && element.contains(target)) {
                handler.call(target, e);
            }
        });
    },

    animate(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: CONFIG.animations.duration.normal,
            easing: CONFIG.animations.easing
        };

        return element.animate(keyframes, { ...defaultOptions, ...options });
    }
};

// 防抖函数
const debounce = (fn, delay = CONFIG.performance.debounceDelay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

// 节流函数
const throttle = (fn, delay = CONFIG.performance.throttleDelay) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
};

// 缓动函数
const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
};

// 导出所有配置和工具（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        DEVICE,
        Performance,
        Debug,
        Storage,
        URLHelper,
        DOM,
        debounce,
        throttle,
        easingFunctions
    };
}
