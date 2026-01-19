// 音效系统
class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = CONFIG.sounds.volume;
        this.audioContext = null;
        this.sounds = {};
        this.masterGain = null;
        this.initialized = false;
    }

    // 初始化音频上下文（需要用户交互）
    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.audioContext.destination);

            // 预加载音效
            await this.loadSounds();
            this.initialized = true;
        } catch (error) {
            // 音频初始化失败，静默处理
        }
    }

    // 加载音效文件
    async loadSounds() {
        const soundFiles = {
            shuffle: CONFIG.sounds.shuffle,
            flip: CONFIG.sounds.flip,
            deal: CONFIG.sounds.deal,
            magic: CONFIG.sounds.magic
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                // 尝试加载文件
                const response = await fetch(path);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    this.sounds[name] = audioBuffer;
                }
            } catch (error) {
                // 如果文件不存在，使用合成音效
                this.sounds[name] = null;
            }
        }
    }

    // 播放音效
    play(soundName) {
        if (!this.enabled || !this.initialized) return;

        const audioBuffer = this.sounds[soundName];
        if (audioBuffer) {
            this.playBuffer(audioBuffer);
        } else {
            // 使用合成音效
            this.playSynthesizedSound(soundName);
        }
    }

    // 播放音频缓冲
    playBuffer(buffer) {
        if (!this.audioContext || !buffer) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // 添加音量包络
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.start(0);
    }

    // 合成音效（当音效文件不可用时）
    playSynthesizedSound(type) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        switch(type) {
            case 'shuffle':
                // 洗牌声：快速的低频噪音
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(100, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'flip':
                // 翻牌声：快速的高音
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;

            case 'deal':
                // 发牌声：中频短音
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                gainNode.gain.setValueAtTime(0.12, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'magic':
                // 魔法声：和谐的和弦
                this.playChord([523.25, 659.25, 783.99], 0.3); // C5, E5, G5
                return;
        }
    }

    // 播放和弦
    playChord(frequencies, duration) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            // 错开时间以产生颤音效果
            const offset = index * 0.05;
            gainNode.gain.setValueAtTime(0, now + offset);
            gainNode.gain.linearRampToValueAtTime(0.08, now + offset + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.start(now + offset);
            oscillator.stop(now + duration);
        });
    }

    // 设置音量
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
        CONFIG.sounds.volume = this.volume;
    }

    // 获取音量
    getVolume() {
        return this.volume;
    }

    // 切换静音
    toggle() {
        this.enabled = !this.enabled;
        CONFIG.sounds.enabled = this.enabled;
        return this.enabled;
    }

    // 启用音效
    enable() {
        this.enabled = true;
        CONFIG.sounds.enabled = true;
    }

    // 禁用音效
    disable() {
        this.enabled = false;
        CONFIG.sounds.enabled = false;
    }

    // 是否启用
    isEnabled() {
        return this.enabled;
    }

    // 恢复音频上下文（浏览器自动播放策略）
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}

// 创建全局音效管理器实例
const audioManager = new AudioManager();

// 导出到全局
window.AudioManager = AudioManager;
window.audioManager = audioManager;
