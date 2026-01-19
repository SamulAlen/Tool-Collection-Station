// ==================== 配置管理 ====================

const CONFIG = {
    // 默认时间设置（分钟）
    times: {
        work: 25,
        shortBreak: 5,
        longBreak: 15
    },

    // 模式配置
    modes: {
        work: {
            name: '工作模式',
            color: '#ff6b6b',
            pomodorosUntilLongBreak: 4
        },
        shortBreak: {
            name: '短休息',
            color: '#00b894'
        },
        longBreak: {
            name: '长休息',
            color: '#0984e3'
        }
    },

    // 主题配置
    themes: ['tomato', 'mint', 'ocean', 'sunshine', 'violet'],

    // 默认设置
    defaults: {
        theme: 'tomato',
        autoStart: false,
        soundEnabled: true,
        soundVolume: 0.7,
        notificationEnabled: true
    },

    // 本地存储键名
    storageKeys: {
        settings: 'pomodoro_settings',
        stats: 'pomodoro_stats',
        tasks: 'pomodoro_tasks',
        todayDate: 'pomodoro_today_date'
    },

    // 圆形进度条配置
    progressRing: {
        radius: 90,
        circumference: 2 * Math.PI * 90 // 约565.48
    }
};

// 用户设置（从localStorage加载或使用默认值）
let userSettings = { ...CONFIG.defaults };

// 当前应用状态
let appState = {
    currentMode: 'work', // work, shortBreak, longBreak
    isRunning: false,
    isPaused: false,
    timeRemaining: CONFIG.times.work * 60, // 秒
    totalTime: CONFIG.times.work * 60, // 秒
    completedPomodoros: 0, // 当前周期内完成的番茄钟数
    currentTaskId: null // 当前关联的任务ID
};

// ==================== 初始化配置 ====================
function initConfig() {
    loadSettings();
    applyTheme(userSettings.theme);
    console.log('配置已初始化', { userSettings, appState });
}

// ==================== 设置管理 ====================
function loadSettings() {
    const saved = localStorage.getItem(CONFIG.storageKeys.settings);
    if (saved) {
        try {
            userSettings = { ...CONFIG.defaults, ...JSON.parse(saved) };
        } catch (e) {
            console.error('加载设置失败:', e);
            userSettings = { ...CONFIG.defaults };
        }
    }
    console.log('设置已加载:', userSettings);
}

function saveSettings() {
    localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(userSettings));
    console.log('设置已保存:', userSettings);
}

function updateSetting(key, value) {
    userSettings[key] = value;
    saveSettings();
}

function getSetting(key) {
    return userSettings[key];
}

// ==================== 主题管理 ====================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    userSettings.theme = theme;
    saveSettings();
    console.log('主题已应用:', theme);
}

function getNextTheme() {
    const currentIndex = CONFIG.themes.indexOf(userSettings.theme);
    const nextIndex = (currentIndex + 1) % CONFIG.themes.length;
    return CONFIG.themes[nextIndex];
}

// ==================== 时间管理 ====================
function getTimeForMode(mode) {
    const key = mode === 'work' ? 'work' : (mode === 'shortBreak' ? 'shortBreak' : 'longBreak');
    return userSettings[key + 'Time'] || CONFIG.times[key];
}

function setTimeForMode(mode, minutes) {
    const key = mode === 'work' ? 'work' : (mode === 'shortBreak' ? 'shortBreak' : 'longBreak');
    userSettings[key + 'Time'] = minutes;
    saveSettings();
}

// ==================== 模式管理 ====================
function setMode(mode) {
    appState.currentMode = mode;
    appState.totalTime = getTimeForMode(mode) * 60;
    appState.timeRemaining = appState.totalTime;
    console.log('模式已切换:', mode, '时间:', appState.totalTime / 60, '分钟');
}

function getCurrentMode() {
    return appState.currentMode;
}

function getModeInfo(mode) {
    return CONFIG.modes[mode] || CONFIG.modes.work;
}

// ==================== 统计管理 ====================
function shouldTakeLongBreak() {
    return appState.completedPomodoros > 0 && appState.completedPomodoros % CONFIG.modes.work.pomodorosUntilLongBreak === 0;
}

function incrementPomodoros() {
    if (appState.currentMode === 'work') {
        appState.completedPomodoros++;
        console.log('番茄钟计数:', appState.completedPomodoros);
    }
}

function resetPomodorosCount() {
    appState.completedPomodoros = 0;
    console.log('番茄钟计数已重置');
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, userSettings, appState };
}
