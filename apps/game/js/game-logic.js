/**
 * 游戏逻辑模块
 * 负责游戏的核心逻辑处理
 */

class WordMatchGame {
    constructor() {
        this.currentPairs = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.gameTimer = null;
        this.isProcessing = false;
        this.selectedCards = [];
        this.config = {
            pairCount: 8,      // 每局游戏的单词对数量
            matchScore: 10,    // 配对成功得分
            timeBonus: 2,      // 时间奖励倍数
            gameDuration: 60   // 游戏时长(秒)
        };
    }

    /**
     * 初始化游戏
     */
    init() {
        this.matchedPairs = 0;
        this.score = 0;
        this.timeLeft = this.config.gameDuration;
        this.selectedCards = [];
        this.isProcessing = false;

        // 随机选择单词对
        this.currentPairs = getRandomPairs(this.config.pairCount);
    }

    /**
     * 选择卡片
     */
    selectCard(cardElement) {
        // 检查是否可以选择
        if (this.isProcessing ||
            cardElement.classList.contains('matched') ||
            cardElement.classList.contains('hidden') ||
            cardElement.classList.contains('selected')) {
            return false;
        }

        // 添加选中状态
        cardElement.classList.add('selected');
        this.selectedCards.push(cardElement);

        // 如果选中了两张卡片,进行检查
        if (this.selectedCards.length === 2) {
            this.isProcessing = true;
            return this.checkMatch();
        }

        return null; // 还没有选择两张卡片
    }

    /**
     * 检查两张卡片是否匹配
     */
    checkMatch() {
        const [card1, card2] = this.selectedCards;
        const isMatch = card1.dataset.pairId === card2.dataset.pairId;

        return {
            isMatch: isMatch,
            cards: [card1, card2]
        };
    }

    /**
     * 处理匹配成功
     */
    handleMatch(cards, onMatchComplete) {
        const [card1, card2] = cards;

        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.score += this.config.matchScore;
            this.matchedPairs++;

            // 更新UI
            this.updateInfo();

            // 隐藏已匹配的卡片
            setTimeout(() => {
                card1.classList.add('hidden');
                card2.classList.add('hidden');
                this.selectedCards = [];
                this.isProcessing = false;

                // 检查是否全部完成
                if (this.matchedPairs === this.currentPairs.length) {
                    onMatchComplete('win');
                }
            }, 500);
        }, 300);
    }

    /**
     * 处理匹配失败
     */
    handleMismatch(cards) {
        const [card1, card2] = cards;

        setTimeout(() => {
            card1.classList.add('wrong');
            card2.classList.add('wrong');

            setTimeout(() => {
                card1.classList.remove('selected', 'wrong');
                card2.classList.remove('selected', 'wrong');
                this.selectedCards = [];
                this.isProcessing = false;
            }, 500);
        }, 300);
    }

    /**
     * 更新游戏信息
     */
    updateInfo() {
        return {
            score: this.score,
            timeLeft: this.timeLeft,
            remaining: this.currentPairs.length - this.matchedPairs
        };
    }

    /**
     * 启动计时器
     */
    startTimer(callback) {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }

        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            callback(this.updateInfo());

            if (this.timeLeft <= 0) {
                this.stopTimer();
                callback('timeout');
            }
        }, 1000);
    }

    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    /**
     * 计算最终得分(包含时间奖励)
     */
    calculateFinalScore() {
        const timeBonus = this.timeLeft * this.config.timeBonus;
        return {
            baseScore: this.score,
            timeBonus: timeBonus,
            totalScore: this.score + timeBonus
        };
    }

    /**
     * 重置游戏
     */
    reset() {
        this.stopTimer();
        this.currentPairs = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.timeLeft = this.config.gameDuration;
        this.selectedCards = [];
        this.isProcessing = false;
    }
}