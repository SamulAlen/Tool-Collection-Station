// ==================== 音效管理 ====================

// Web Audio API 上下文
let audioContext = null;

// ==================== 初始化音频 ====================
function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('音频上下文已初始化');
        } catch (e) {
            console.error('Web Audio API 不支持:', e);
        }
    }
    return audioContext;
}

// ==================== 播放提示音 ====================
function playNotificationSound(type = 'work') {
    if (!getSetting('soundEnabled')) {
        console.log('音效已禁用');
        return;
    }

    const ctx = initAudio();
    if (!ctx) return;

    // 恢复音频上下文（某些浏览器需要用户交互后才能播放）
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            playSound(ctx, type);
        });
    } else {
        playSound(ctx, type);
    }
}

function playSound(ctx, type) {
    const volume = getSetting('soundVolume') || 0.7;
    const now = ctx.currentTime;

    if (type === 'work') {
        // 工作结束音 - 愉悦的和弦
        playChord(ctx, now, volume);
    } else {
        // 休息结束音 - 轻柔的提醒
        playGentle(ctx, now, volume);
    }
}

// ==================== 播放和弦音（工作结束） ====================
function playChord(ctx, now, volume) {
    // C大调和弦 (C4, E4, G4, C5)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const duration = 0.3;

    notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // 音量包络
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01 + index * 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + index * 0.05);

        oscillator.start(now + index * 0.02);
        oscillator.stop(now + duration + index * 0.05 + 0.1);
    });

    // 添加第二个和弦
    setTimeout(() => {
        const notes2 = [659.25, 783.99, 987.77, 1318.51];
        notes2.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.25, ctx.currentTime + 0.01 + index * 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration + index * 0.05);

            oscillator.start(ctx.currentTime + index * 0.02);
            oscillator.stop(ctx.currentTime + duration + index * 0.05 + 0.1);
        });
    }, 150);
}

// ==================== 播放轻柔音（休息结束） ====================
function playGentle(ctx, now, volume) {
    // 温柔的升调提醒
    const frequencies = [440, 554.37, 659.25];
    const duration = 0.2;

    frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now + index * 0.15);

        gainNode.gain.setValueAtTime(0, now + index * 0.15);
        gainNode.gain.linearRampToValueAtTime(volume * 0.2, now + index * 0.15 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + duration);

        oscillator.start(now + index * 0.15);
        oscillator.stop(now + index * 0.15 + duration + 0.1);
    });
}

// ==================== 播放点击音 ====================
function playClickSound() {
    if (!getSetting('soundEnabled')) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const volume = (getSetting('soundVolume') || 0.7) * 0.3;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
}

// ==================== 播放完成音 ====================
function playCompleteSound() {
    if (!getSetting('soundEnabled')) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const volume = getSetting('soundVolume') || 0.7;

    // 成功的三连音
    [523.25, 659.25, 783.99].forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now + index * 0.1);

        gainNode.gain.setValueAtTime(0, now + index * 0.1);
        gainNode.gain.linearRampToValueAtTime(volume * 0.2, now + index * 0.1 + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.15);

        oscillator.start(now + index * 0.1);
        oscillator.stop(now + index * 0.1 + 0.2);
    });
}

// ==================== 音量控制 ====================
function setVolume(volume) {
    updateSetting('soundVolume', volume);
    console.log('音量已设置为:', volume);
}

function getVolume() {
    return getSetting('soundVolume') || 0.7;
}

// ==================== 测试音效 ====================
function testSound() {
    playNotificationSound('work');
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        playNotificationSound,
        playClickSound,
        playCompleteSound,
        setVolume,
        getVolume,
        testSound
    };
}
