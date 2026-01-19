/**
 * UI控制器模块
 * 负责游戏界面的渲染和交互
 */

class UIController {
    constructor() {
        this.game = new WordMatchGame();
        this.elements = {
            gameContainer: document.getElementById('gameContainer'),
            score: document.getElementById('score'),
            time: document.getElementById('time'),
            remaining: document.getElementById('remaining'),
            message: document.getElementById('message'),
            messageTitle: document.getElementById('messageTitle'),
            messageText: document.getElementById('messageText'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            playAgainBtn: document.getElementById('playAgainBtn')
        };

        this.bindEvents();
    }

    /**
     * 绑定事件监听
     */
    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => {
            audioGenerator.init(); // 初始化音频上下文
            this.startGame();
        });
        // 重新开始按钮直接重开一局
        this.elements.resetBtn.addEventListener('click', () => this.startGame());
        this.elements.playAgainBtn.addEventListener('click', () => this.startGame());
    }

    /**
     * 播放音效
     */
    playSound(soundName) {
        if (soundName === 'match') {
            audioGenerator.playMatchSound();
        } else if (soundName === 'wrong') {
            audioGenerator.playWrongSound();
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.hideMessage();
        this.game.init();
        this.renderGame();
        this.updateInfo();

        // 启动计时器
        this.game.startTimer((data) => {
            if (data === 'timeout') {
                this.endGame(false);
            } else {
                this.updateInfo(data);
            }
        });
    }

    /**
     * 渲染游戏界面
     */
    renderGame() {
        const container = this.elements.gameContainer;
        container.innerHTML = '';

        // 创建所有卡片
        const allCards = [];
        this.game.currentPairs.forEach(pair => {
            allCards.push(...createWordCards(pair));
        });

        // 打乱卡片顺序
        const shuffledCards = shuffleArray(allCards);

        // 渲染卡片
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'word-card';
            cardElement.textContent = card.text;
            cardElement.dataset.id = card.id;
            cardElement.dataset.pairId = card.pairId;
            cardElement.onclick = () => this.handleCardClick(cardElement);
            container.appendChild(cardElement);
        });
    }

    /**
     * 处理卡片点击
     */
    handleCardClick(cardElement) {
        const result = this.game.selectCard(cardElement);

        if (result === null) {
            return; // 还没有选择两张卡片
        }

        if (result === false) {
            return; // 无法选择这张卡片
        }

        if (result.isMatch) {
            // 播放匹配成功音效
            this.playSound('match');
            // 使用回调函数处理游戏完成
            this.game.handleMatch(result.cards, (gameResult) => {
                if (gameResult === 'win') {
                    setTimeout(() => this.endGame(true), 200);
                }
            });
        } else {
            // 播放匹配失败音效
            this.playSound('wrong');
            this.game.handleMismatch(result.cards);
        }
    }

    /**
     * 更新游戏信息显示
     */
    updateInfo(data) {
        const info = data || this.game.updateInfo();
        this.elements.score.textContent = info.score;
        this.elements.time.textContent = info.timeLeft;
        this.elements.remaining.textContent = info.remaining;
    }

    /**
     * 结束游戏
     */
    endGame(won) {
        this.game.stopTimer();

        const scores = this.game.calculateFinalScore();

        if (won) {
            this.elements.messageTitle.textContent = '🎉 恭喜通关!';
            this.elements.messageText.textContent =
                `得分: ${scores.totalScore} (基础分: ${scores.baseScore} + 时间奖励: ${scores.timeBonus})`;
        } else {
            const progress = `${this.game.matchedPairs}/${this.game.currentPairs.length}`;
            this.elements.messageTitle.textContent = '⏰ 时间到!';
            this.elements.messageText.textContent =
                `得分: ${this.game.score} | 完成进度: ${progress}`;
        }

        this.showMessage();
    }

    /**
     * 显示消息弹窗
     */
    showMessage() {
        this.elements.message.classList.add('show');
    }

    /**
     * 隐藏消息弹窗
     */
    hideMessage() {
        this.elements.message.classList.remove('show');
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    ui.updateInfo({
        score: 0,
        timeLeft: 60,
        remaining: 0
    });
});