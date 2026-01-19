// ==================== 数据存储管理 ====================

// 默认统计数据
const defaultStats = {
    totalPomodoros: 0,
    totalFocusMinutes: 0,
    dailyStats: {}
};

// 当前统计数据
let stats = { ...defaultStats };

// ==================== 初始化存储 ====================
function initStorage() {
    loadStats();
    checkNewDay();
    console.log('存储已初始化', stats);
}

// ==================== 统计数据管理 ====================
function loadStats() {
    const saved = localStorage.getItem(CONFIG.storageKeys.stats);
    if (saved) {
        try {
            stats = { ...defaultStats, ...JSON.parse(saved) };
        } catch (e) {
            console.error('加载统计数据失败:', e);
            stats = { ...defaultStats };
        }
    }
    console.log('统计数据已加载:', stats);
}

function saveStats() {
    localStorage.setItem(CONFIG.storageKeys.stats, JSON.stringify(stats));
    console.log('统计数据已保存:', stats);
}

// ==================== 日期管理 ====================
function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function checkNewDay() {
    const todayKey = getTodayKey();
    const lastDate = localStorage.getItem(CONFIG.storageKeys.todayDate);

    if (lastDate !== todayKey) {
        // 新的一天，重置今日统计
        localStorage.setItem(CONFIG.storageKeys.todayDate, todayKey);
        console.log('新的一天，今日统计已重置');
    }
}

// ==================== 今日统计 ====================
function getTodayStats() {
    const todayKey = getTodayKey();
    if (!stats.dailyStats[todayKey]) {
        stats.dailyStats[todayKey] = {
            pomodoros: 0,
            focusMinutes: 0
        };
    }
    return stats.dailyStats[todayKey];
}

function getTodayPomodoros() {
    return getTodayStats().pomodoros;
}

function getTodayFocusMinutes() {
    return getTodayStats().focusMinutes;
}

// ==================== 添加记录 ====================
function addPomodoro(minutes) {
    const todayKey = getTodayKey();

    // 更新今日统计
    if (!stats.dailyStats[todayKey]) {
        stats.dailyStats[todayKey] = { pomodoros: 0, focusMinutes: 0 };
    }
    stats.dailyStats[todayKey].pomodoros++;
    stats.dailyStats[todayKey].focusMinutes += minutes;

    // 更新总计统计
    stats.totalPomodoros++;
    stats.totalFocusMinutes += minutes;

    saveStats();
    console.log('番茄钟已记录:', { today: stats.dailyStats[todayKey], total: stats.totalPomodoros });
}

// ==================== 获取统计数据 ====================
function getTotalPomodoros() {
    return stats.totalPomodoros;
}

function getTotalFocusMinutes() {
    return stats.totalFocusMinutes;
}

function formatFocusMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// ==================== 清除数据 ====================
function clearAllData() {
    localStorage.removeItem(CONFIG.storageKeys.settings);
    localStorage.removeItem(CONFIG.storageKeys.stats);
    localStorage.removeItem(CONFIG.storageKeys.tasks);
    localStorage.removeItem(CONFIG.storageKeys.todayDate);
    console.log('所有数据已清除');

    // 重新初始化
    stats = { ...defaultStats };
    userSettings = { ...CONFIG.defaults };
}

// ==================== 导出数据 ====================
function exportData() {
    const data = {
        settings: userSettings,
        stats: stats,
        tasks: getTasks(),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
}

function downloadExport() {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-backup-${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('数据已导出');
}

// ==================== 导入数据 ====================
function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        // 导入设置
        if (data.settings) {
            userSettings = { ...CONFIG.defaults, ...data.settings };
            localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(userSettings));
        }

        // 导入统计
        if (data.stats) {
            stats = { ...defaultStats, ...data.stats };
            localStorage.setItem(CONFIG.storageKeys.stats, JSON.stringify(stats));
        }

        // 导入任务
        if (data.tasks) {
            localStorage.setItem(CONFIG.storageKeys.tasks, JSON.stringify(data.tasks));
        }

        console.log('数据已导入');
        return true;
    } catch (e) {
        console.error('导入数据失败:', e);
        return false;
    }
}

// ==================== 获取周/月统计 ====================
function getWeeklyStats() {
    const weekData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        weekData.push({
            date: key,
            ...stats.dailyStats[key]
        });
    }

    return weekData;
}

function getMonthlyStats() {
    const today = new Date();
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    let monthlyPomodoros = 0;
    let monthlyMinutes = 0;

    for (const [date, data] of Object.entries(stats.dailyStats)) {
        if (date.startsWith(monthKey)) {
            monthlyPomodoros += data.pomodoros;
            monthlyMinutes += data.focusMinutes;
        }
    }

    return {
        pomodoros: monthlyPomodoros,
        focusMinutes: monthlyMinutes,
        month: monthKey
    };
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        stats,
        addPomodoro,
        getTodayPomodoros,
        getTodayFocusMinutes,
        getTotalPomodoros,
        getTotalFocusMinutes,
        formatFocusMinutes,
        clearAllData,
        exportData,
        importData,
        getWeeklyStats,
        getMonthlyStats
    };
}
