// 配置常量
const CONFIG = {
    // Canvas设置
    CANVAS: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight
    },

    // 烟花设置
    FIREWORK: {
        GRAVITY: 0.15,
        TRAIL_LENGTH: 20,
        PARTICLE_COUNT: 100,
        AUTO_LAUNCH_INTERVAL: 1000
    },

    // 粒子设置
    PARTICLE: {
        DEFAULT_LIFE: 45,
        MIN_SIZE: 1.5,
        MAX_SIZE: 3.5,
        GRAVITY: 0.05,
        TRAIL_LENGTH: 15
    },

    // 背景设置
    BACKGROUND: {
        STAR_COUNT: 12,
        STAR_MIN_SIZE: 1,
        STAR_MAX_SIZE: 2,
        STAR_MIN_SPEED: 0.1,
        STAR_MAX_SPEED: 0.4,
        STAR_MIN_OPACITY: 0.4,
        STAR_MAX_OPACITY: 0.7
    },

    // 屏幕闪烁设置
    SCREEN_FLASH: {
        MAX_OPACITY: 0.3,
        FADE_IN_SPEED: 0.05,
        FADE_OUT_SPEED: 0.02
    },

    // 烟花类型
    FIREWORK_TYPES: [
        'heart',      // 觅虹甜心
        'star',       // 超新星
        'rings',      // 全息光环
        'radial',     // 液态金芒
        'fan',        // 数码流呈
        'flower'      // 机械繁花
    ]
};
