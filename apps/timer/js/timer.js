// ==================== 计时器核心逻辑 ====================

// 计时器相关变量
let timerInterval = null;
let timerEndTime = null;

// ==================== 初始化计时器 ====================
function initTimer() {
    setMode('work');
    updateTimerDisplay();
    updateProgressBar();
    console.log('计时器已初始化');
}

// ==================== 时间格式化 ====================
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ==================== 更新时间显示 ====================
function updateTimerDisplay() {
    const timeDisplay = document.getElementById('timerTime');
    const modeLabel = document.getElementById('modeLabel');
    const timerStatus = document.getElementById('timerStatus');

    // 更新时间显示
    timeDisplay.textContent = formatTime(appState.timeRemaining);

    // 更新模式标签
    const modeInfo = getModeInfo(appState.currentMode);
    modeLabel.textContent = modeInfo.name;

    // 更新状态
    if (appState.isRunning) {
        timerStatus.textContent = '进行中...';
    } else if (appState.isPaused) {
        timerStatus.textContent = '已暂停';
    } else {
        timerStatus.textContent = '准备开始';
    }

    // 更新页面标题
    const titleIcon = appState.currentMode === 'work' ? '🍅' : '☕';
    document.title = appState.isRunning || appState.isPaused
        ? `(${formatTime(appState.timeRemaining)}) ${titleIcon} 番茄计时器`
        : `${titleIcon} 番茄计时器`;
}

// ==================== 更新进度条 ====================
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (appState.totalTime - appState.timeRemaining) / appState.totalTime;
    const offset = CONFIG.progressRing.circumference * (1 - progress);
    progressBar.style.strokeDashoffset = offset;
}

// ==================== 开始计时器 ====================
function startTimer() {
    if (appState.isRunning) return;

    appState.isRunning = true;
    appState.isPaused = false;

    // 记录结束时间（使用Date.now()确保准确性）
    timerEndTime = Date.now() + (appState.timeRemaining * 1000);

    // 立即更新UI
    updateTimerDisplay();
    updateModeButtons();
    updateControlButtons();

    // 启动定时器
    timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((timerEndTime - now) / 1000);

        if (remaining <= 0) {
            // 计时结束
            appState.timeRemaining = 0;
            updateTimerDisplay();
            updateProgressBar();
            timerComplete();
        } else {
            appState.timeRemaining = remaining;
            updateTimerDisplay();
            updateProgressBar();
        }
    }, 100); // 100ms检查一次，更流畅

    console.log('计时器已启动');
}

// ==================== 暂停计时器 ====================
function pauseTimer() {
    if (!appState.isRunning || appState.isPaused) return;

    clearInterval(timerInterval);
    appState.isPaused = true;
    appState.isRunning = false;

    updateTimerDisplay();
    updateControlButtons();

    console.log('计时器已暂停');
}

// ==================== 继续计时器 ====================
function resumeTimer() {
    if (!appState.isPaused) return;

    appState.isPaused = false;
    startTimer();
    console.log('计时器已继续');
}

// ==================== 重置计时器 ====================
function resetTimer() {
    clearInterval(timerInterval);
    appState.isRunning = false;
    appState.isPaused = false;
    appState.timeRemaining = appState.totalTime;

    updateTimerDisplay();
    updateProgressBar();
    updateControlButtons();

    console.log('计时器已重置');
}

// ==================== 跳过当前时段 ====================
function skipTimer() {
    clearInterval(timerInterval);
    timerComplete(true); // true 表示被跳过
}

// ==================== 计时结束处理 ====================
function timerComplete(skipped = false) {
    clearInterval(timerInterval);
    appState.isRunning = false;
    appState.isPaused = false;

    const wasWork = appState.currentMode === 'work';

    if (wasWork && !skipped) {
        // 工作完成，记录统计
        const minutes = Math.floor(appState.totalTime / 60);
        addPomodoro(minutes);
        incrementPomodoros();

        // 如果有当前任务，添加番茄钟
        if (appState.currentTaskId) {
            addPomodoroToTask(appState.currentTaskId);
        }

        // 显示完成通知
        showCompletionNotification();
    } else if (!skipped) {
        // 休息完成
        showBreakEndNotification();
    }

    // 播放声音
    playNotificationSound(wasWork ? 'work' : 'break');

    // 页面闪烁提醒
    triggerFlashAlert();

    // 更新统计显示
    updateStatsDisplay();

    // 切换到下一个模式
    if (wasWork && !skipped) {
        // 工作完成后进入休息
        if (shouldTakeLongBreak()) {
            switchMode('longBreak');
        } else {
            switchMode('shortBreak');
        }
        // 自动开始
        if (getSetting('autoStart')) {
            setTimeout(() => startTimer(), 1000);
        }
    } else if (!wasWork && !skipped) {
        // 休息完成后回到工作
        switchMode('work');
        if (getSetting('autoStart')) {
            setTimeout(() => startTimer(), 1000);
        }
    } else {
        // 被跳过，手动切换模式
        resetTimer();
    }

    updateModeButtons();
    updateControlButtons();
    updateTimerDisplay();
    updateProgressBar();
}

// ==================== 切换模式 ====================
function switchMode(mode) {
    // 如果计时器正在运行，先确认
    if (appState.isRunning || appState.isPaused) {
        const confirm = window.confirm('计时器正在运行，确定要切换模式吗？');
        if (!confirm) return;
    }

    clearInterval(timerInterval);
    appState.isRunning = false;
    appState.isPaused = false;

    setMode(mode);
    updateTimerDisplay();
    updateProgressBar();
    updateModeButtons();
    updateControlButtons();

    console.log('已切换到', getModeInfo(mode).name);
}

// ==================== 更新模式按钮 ====================
function updateModeButtons() {
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => {
        if (btn.dataset.mode === appState.currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==================== 更新控制按钮 ====================
function updateControlButtons() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    if (appState.isRunning) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        pauseBtn.textContent = '暂停';
    } else if (appState.isPaused) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        pauseBtn.textContent = '继续';
    } else {
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }
}

// ==================== 显示完成通知 ====================
function showCompletionNotification() {
    const message = `番茄钟完成！已完成 ${appState.completedPomodoros} 个番茄钟`;
    showNotification(message, 'success');

    // 桌面通知
    if (getSetting('notificationEnabled')) {
        sendDesktopNotification('番茄钟完成', '恭喜！你完成了一个番茄钟，休息一下吧！');
    }
}

// ==================== 显示休息结束通知 ====================
function showBreakEndNotification() {
    const message = '休息结束，准备开始新的番茄钟！';
    showNotification(message, 'info');

    // 桌面通知
    if (getSetting('notificationEnabled')) {
        sendDesktopNotification('休息结束', '准备好开始新的番茄钟了吗？');
    }
}

// ==================== 桌面通知 ====================
function sendDesktopNotification(title, body) {
    if (!('Notification' in window)) {
        console.log('浏览器不支持桌面通知');
        return;
    }

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
                });
            }
        });
    }
}

// ==================== 请求通知权限 ====================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ==================== 页面闪烁提醒 ====================
function triggerFlashAlert() {
    const overlay = document.getElementById('flashOverlay');
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 3000);
}

// ==================== 获取剩余时间 ====================
function getTimeRemaining() {
    return appState.timeRemaining;
}

// ==================== 检查是否运行中 ====================
function isTimerRunning() {
    return appState.isRunning;
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        skipTimer,
        switchMode,
        formatTime,
        getTimeRemaining,
        isTimerRunning
    };
}
