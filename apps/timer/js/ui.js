// ==================== UI交互管理 ====================

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面已加载，初始化中...');

    // 初始化所有模块
    initConfig();
    initStorage();
    initTasks();
    initTimer();
    initAudio();

    // 请求通知权限
    requestNotificationPermission();

    // 绑定所有事件
    bindEvents();

    // 更新显示
    updateStatsDisplay();
    renderTaskList();

    // 应用当前主题
    applyTheme(userSettings.theme);

    console.log('初始化完成');
});

// ==================== 绑定事件 ====================
function bindEvents() {
    // 控制按钮
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', () => {
        if (appState.isPaused) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    });
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('skipBtn').addEventListener('click', skipTimer);

    // 模式切换按钮
    document.getElementById('workModeBtn').addEventListener('click', () => switchMode('work'));
    document.getElementById('shortBreakBtn').addEventListener('click', () => switchMode('shortBreak'));
    document.getElementById('longBreakBtn').addEventListener('click', () => switchMode('longBreak'));

    // 头部按钮
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);

    // 设置面板
    document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
    document.getElementById('settingsPanel').addEventListener('click', (e) => {
        if (e.target.id === 'settingsPanel') {
            closeSettings();
        }
    });

    // 设置项变更
    document.getElementById('workTime').addEventListener('change', (e) => {
        setTimeForMode('work', parseInt(e.target.value));
        if (appState.currentMode === 'work' && !appState.isRunning && !appState.isPaused) {
            setMode('work');
            updateTimerDisplay();
        }
    });

    document.getElementById('shortBreakTime').addEventListener('change', (e) => {
        setTimeForMode('shortBreak', parseInt(e.target.value));
        if (appState.currentMode === 'shortBreak' && !appState.isRunning && !appState.isPaused) {
            setMode('shortBreak');
            updateTimerDisplay();
        }
    });

    document.getElementById('longBreakTime').addEventListener('change', (e) => {
        setTimeForMode('longBreak', parseInt(e.target.value));
        if (appState.currentMode === 'longBreak' && !appState.isRunning && !appState.isPaused) {
            setMode('longBreak');
            updateTimerDisplay();
        }
    });

    document.getElementById('autoStart').addEventListener('change', (e) => {
        updateSetting('autoStart', e.target.checked);
    });

    document.getElementById('soundEnabled').addEventListener('change', (e) => {
        updateSetting('soundEnabled', e.target.checked);
        if (e.target.checked) {
            playClickSound(); // 测试音效
        }
    });

    document.getElementById('soundVolume').addEventListener('change', (e) => {
        updateSetting('soundVolume', parseInt(e.target.value) / 100);
    });

    document.getElementById('notificationEnabled').addEventListener('change', (e) => {
        updateSetting('notificationEnabled', e.target.checked);
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });

    // 主题选择
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            updateThemeButtons();
        });
    });

    // 数据管理
    document.getElementById('resetDataBtn').addEventListener('click', () => {
        if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
            clearAllData();
            showNotification('所有数据已清除', 'warning');
            location.reload();
        }
    });

    // 任务管理
    document.getElementById('addTaskBtn').addEventListener('click', handleAddTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });
}

// ==================== 主题切换 ====================
function toggleTheme() {
    playClickSound();
    const nextTheme = getNextTheme();
    applyTheme(nextTheme);
    updateThemeButtons();
    showNotification(`主题已切换: ${getThemeName(nextTheme)}`, 'success');
}

function getThemeName(theme) {
    const names = {
        tomato: '经典番茄红',
        mint: '清新薄荷绿',
        ocean: '宁静海洋蓝',
        sunshine: '温暖阳光橙',
        violet: '优雅紫罗兰'
    };
    return names[theme] || theme;
}

function updateThemeButtons() {
    document.querySelectorAll('.theme-option').forEach(btn => {
        if (btn.dataset.theme === userSettings.theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==================== 设置面板 ====================
function openSettings() {
    playClickSound();
    const panel = document.getElementById('settingsPanel');

    // 加载当前设置
    document.getElementById('workTime').value = getTimeForMode('work');
    document.getElementById('shortBreakTime').value = getTimeForMode('shortBreak');
    document.getElementById('longBreakTime').value = getTimeForMode('longBreak');
    document.getElementById('autoStart').checked = getSetting('autoStart');
    document.getElementById('soundEnabled').checked = getSetting('soundEnabled');
    document.getElementById('soundVolume').value = Math.round((getSetting('soundVolume') || 0.7) * 100);
    document.getElementById('notificationEnabled').checked = getSetting('notificationEnabled');

    updateThemeButtons();

    panel.classList.add('open');
}

function closeSettings() {
    playClickSound();
    document.getElementById('settingsPanel').classList.remove('open');
}

// ==================== 统计显示 ====================
function updateStatsDisplay() {
    document.getElementById('todayCount').textContent = getTodayPomodoros();
    document.getElementById('totalCount').textContent = getTotalPomodoros();
    document.getElementById('focusTime').textContent = formatFocusMinutes(getTodayFocusMinutes());
}

// ==================== 任务管理 ====================
function handleAddTask() {
    const input = document.getElementById('taskInput');
    const name = input.value.trim();

    if (!name) {
        showNotification('请输入任务名称', 'warning');
        return;
    }

    const result = addTask(name);
    if (result.success) {
        input.value = '';
        renderTaskList();
        playCompleteSound();
        showNotification('任务已添加', 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

function renderTaskList() {
    const container = document.getElementById('taskList');
    const activeTasks = getActiveTasks();

    if (activeTasks.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无任务，添加一个任务开始吧！</p>';
        return;
    }

    container.innerHTML = activeTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="handleTaskCheckbox('${task.id}')"></div>
            <div class="task-content">
                <div class="task-name">${escapeHtml(task.name)}</div>
                <div class="task-pomodoros">🍅 ${task.completedPomodoros}</div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn add-pomodoro" onclick="handleAddPomodoroToTask('${task.id}')" title="添加番茄钟">+</button>
                <button class="task-action-btn delete" onclick="handleDeleteTask('${task.id}')" title="删除">🗑️</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 任务操作（全局函数） ====================
window.handleTaskCheckbox = function(id) {
    playClickSound();
    toggleTaskComplete(id);
    renderTaskList();
};

window.handleAddPomodoroToTask = function(id) {
    playClickSound();
    addPomodoroToTask(id);
    renderTaskList();
    showNotification('番茄钟已添加到任务', 'success');
};

window.handleDeleteTask = function(id) {
    playClickSound();
    if (confirm('确定要删除这个任务吗？')) {
        deleteTask(id);
        renderTaskList();
        showNotification('任务已删除', 'info');
    }
};

// ==================== 通知提示 ====================
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // 如果在输入框中，不触发快捷键
    if (e.target.tagName === 'INPUT') return;

    // 如果设置面板打开，不触发快捷键
    if (document.getElementById('settingsPanel').classList.contains('open')) return;

    switch(e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (appState.isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
            break;
        case 'r':
        case 'R':
            resetTimer();
            break;
        case 's':
        case 'S':
            skipTimer();
            break;
    }
});

// ==================== 页面可见性处理 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('页面隐藏');
    } else {
        console.log('页面可见');
        // 重新同步时间显示
        if (appState.isRunning && timerEndTime) {
            const now = Date.now();
            const remaining = Math.ceil((timerEndTime - now) / 1000);
            if (remaining >= 0) {
                appState.timeRemaining = remaining;
                updateTimerDisplay();
            }
        }
    }
});

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        updateStatsDisplay,
        renderTaskList,
        openSettings,
        closeSettings
    };
}
