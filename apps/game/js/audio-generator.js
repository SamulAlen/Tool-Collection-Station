/**
 * 音效生成器
 * 使用Web Audio API生成游戏音效
 */

class AudioGenerator {
    constructor() {
        this.audioContext = null;
    }

    /**
     * 初始化AudioContext
     */
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    /**
     * 生成匹配成功音效
     * 愉悦的上扬音调
     */
    playMatchSound() {
        const ctx = this.init();
        const now = ctx.currentTime;

        // 创建振荡器
        const oscillator1 = ctx.createOscillator();
        const oscillator2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 连接节点
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 设置音调类型
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';

        // 设置频率 (和弦效果)
        oscillator1.frequency.setValueAtTime(523.25, now); // C5
        oscillator1.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5

        oscillator2.frequency.setValueAtTime(659.25, now); // E5
        oscillator2.frequency.exponentialRampToValueAtTime(987.77, now + 0.1); // B5

        // 设置音量包络
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        // 播放
        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + 0.3);
        oscillator2.stop(now + 0.3);
    }

    /**
     * 生成匹配失败音效
     * 低沉的下降音调
     */
    playWrongSound() {
        const ctx = this.init();
        const now = ctx.currentTime;

        // 创建振荡器
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 设置音调类型
        oscillator.type = 'sawtooth';

        // 设置频率 (下降效果)
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);

        // 设置音量包络
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        // 播放
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
}

// 创建全局音效生成器实例
const audioGenerator = new AudioGenerator();