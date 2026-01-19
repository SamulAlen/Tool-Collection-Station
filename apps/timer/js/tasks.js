// ==================== 任务管理 ====================

// 任务列表
let tasks = [];

// ==================== 初始化任务 ====================
function initTasks() {
    loadTasks();
    console.log('任务已初始化:', tasks);
}

// ==================== 加载和保存任务 ====================
function loadTasks() {
    const saved = localStorage.getItem(CONFIG.storageKeys.tasks);
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            console.error('加载任务失败:', e);
            tasks = [];
        }
    }
}

function saveTasks() {
    localStorage.setItem(CONFIG.storageKeys.tasks, JSON.stringify(tasks));
    console.log('任务已保存:', tasks);
}

// ==================== 获取所有任务 ====================
function getTasks() {
    return tasks;
}

// ==================== 添加任务 ====================
function addTask(name) {
    if (!name || name.trim() === '') {
        return { success: false, message: '任务名称不能为空' };
    }

    const task = {
        id: Date.now().toString(),
        name: name.trim(),
        completed: false,
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        createdAt: new Date().toISOString(),
        order: tasks.length
    };

    tasks.push(task);
    saveTasks();
    console.log('任务已添加:', task);
    return { success: true, task };
}

// ==================== 更新任务 ====================
function updateTask(id, updates) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveTasks();
        console.log('任务已更新:', tasks[index]);
        return { success: true, task: tasks[index] };
    }
    return { success: false, message: '任务不存在' };
}

// ==================== 删除任务 ====================
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        const deleted = tasks.splice(index, 1)[0];
        // 更新其他任务的顺序
        tasks.forEach((task, i) => task.order = i);
        saveTasks();
        console.log('任务已删除:', deleted);
        return { success: true, task: deleted };
    }
    return { success: false, message: '任务不存在' };
}

// ==================== 切换任务完成状态 ====================
function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        console.log('任务状态已切换:', task);
        return { success: true, task };
    }
    return { success: false, message: '任务不存在' };
}

// ==================== 添加番茄钟到任务 ====================
function addPomodoroToTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completedPomodoros++;
        saveTasks();
        console.log('番茄钟已添加到任务:', task);
        playCompleteSound();
        return { success: true, task };
    }
    return { success: false, message: '任务不存在' };
}

// ==================== 设置当前任务 ====================
function setCurrentTask(id) {
    appState.currentTaskId = id;
    const task = tasks.find(t => t.id === id);
    console.log('当前任务已设置:', task?.name || '无');
    return { success: true, taskId: id };
}

// ==================== 获取当前任务 ====================
function getCurrentTask() {
    if (appState.currentTaskId) {
        return tasks.find(t => t.id === appState.currentTaskId);
    }
    return null;
}

// ==================== 移动任务顺序 ====================
function moveTask(id, direction) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return { success: false, message: '任务不存在' };

    if (direction === 'up' && index > 0) {
        [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
    } else if (direction === 'down' && index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    } else {
        return { success: false, message: '无法移动' };
    }

    // 更新顺序
    tasks.forEach((task, i) => task.order = i);
    saveTasks();
    console.log('任务顺序已更新');
    return { success: true };
}

// ==================== 清除已完成任务 ====================
function clearCompletedTasks() {
    const beforeLength = tasks.length;
    tasks = tasks.filter(t => !t.completed);
    // 更新顺序
    tasks.forEach((task, i) => task.order = i);
    saveTasks();
    const cleared = beforeLength - tasks.length;
    console.log('已清除', cleared, '个已完成任务');
    return { success: true, cleared };
}

// ==================== 获取任务统计 ====================
function getTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const totalPomodoros = tasks.reduce((sum, t) => sum + t.completedPomodoros, 0);

    return { total, completed, active, totalPomodoros };
}

// ==================== 编辑任务名称 ====================
function editTaskName(id, newName) {
    if (!newName || newName.trim() === '') {
        return { success: false, message: '任务名称不能为空' };
    }

    return updateTask(id, { name: newName.trim() });
}

// ==================== 设置预计番茄钟数 ====================
function setTaskEstimate(id, estimate) {
    if (estimate < 1) estimate = 1;
    return updateTask(id, { estimatedPomodoros: estimate });
}

// ==================== 获取活动任务 ====================
function getActiveTasks() {
    return tasks.filter(t => !t.completed).sort((a, b) => a.order - b.order);
}

// ==================== 获取已完成任务 ====================
function getCompletedTasks() {
    return tasks.filter(t => t.completed).sort((a, b) => a.order - b.order);
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        tasks,
        getTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addPomodoroToTask,
        setCurrentTask,
        getCurrentTask,
        moveTask,
        clearCompletedTasks,
        getTaskStats,
        editTaskName,
        setTaskEstimate,
        getActiveTasks,
        getCompletedTasks
    };
}
