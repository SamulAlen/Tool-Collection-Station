// 牌组管理系统
class TarotDeck {
    constructor() {
        this.cards = [];
        this.drawnCards = [];
        this.isShuffling = false;

        // 牌组位置
        this.deckX = 0;
        this.deckY = 0;

        // 初始化牌组
        this.initDeck();
    }

    // 初始化牌组
    initDeck() {
        const allCards = getAllCards();
        this.cards = allCards.map(cardData => {
            // 创建卡牌并堆叠在一起
            return new TarotCard(cardData, this.deckX, this.deckY);
        });
    }

    // 设置牌组位置
    setPosition(x, y) {
        this.deckX = x;
        this.deckY = y;

        // 如果没有抽牌，更新所有卡牌位置
        if (this.drawnCards.length === 0) {
            this.cards.forEach((card, index) => {
                const offsetX = (index % 5) * 0.5;
                const offsetY = Math.floor(index / 5) * 0.5;
                card.x = x + offsetX;
                card.y = y + offsetY;
                card.targetX = x + offsetX;
                card.targetY = y + offsetY;
            });
        } else {
            // 已抽牌的卡牌保持原位
            this.cards.forEach(card => {
                if (!this.drawnCards.includes(card)) {
                    card.x = x;
                    card.y = y;
                    card.targetX = x;
                    card.targetY = y;
                }
            });
        }
    }

    // 洗牌
    async shuffle() {
        if (this.isShuffling) return;
        this.isShuffling = true;

        audioManager.play('shuffle');

        // 触发洗牌粒子效果
        if (window.magicParticles) {
            window.magicParticles.createShuffleEffect(this.deckX, this.deckY);
        }

        // 第一步：将所有卡牌集中到牌组位置
        await this.gatherCards();

        // 第二步：执行洗牌动画
        await this.performShuffleAnimation();

        // 第三步：重新排列
        this.reorderCards();

        this.isShuffling = false;
    }

    // 集中所有卡牌
    async gatherCards() {
        return new Promise(resolve => {
            const duration = 500;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = Easing.easeInOutQuad(progress);

                this.cards.forEach((card, index) => {
                    // 添加一些随机偏移
                    const randomOffsetX = (Math.random() - 0.5) * 20 * (1 - eased);
                    const randomOffsetY = (Math.random() - 0.5) * 20 * (1 - eased);

                    card.targetX = this.deckX + randomOffsetX;
                    card.targetY = this.deckY + randomOffsetY;
                    card.targetRotation = (Math.random() - 0.5) * 0.2 * (1 - eased);
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }

    // 执行洗牌动画
    async performShuffleAnimation() {
        return new Promise(resolve => {
            const shuffleCount = 5; // 洗牌次数
            let currentShuffle = 0;

            const doShuffle = () => {
                if (currentShuffle >= shuffleCount) {
                    resolve();
                    return;
                }

                // 将卡牌分成两堆
                const midPoint = Math.floor(this.cards.length / 2);
                const leftPile = this.cards.slice(0, midPoint);
                const rightPile = this.cards.slice(midPoint);

                // 交错合并
                const shuffled = [];
                for (let i = 0; i < midPoint; i++) {
                    shuffled.push(leftPile[i]);
                    shuffled.push(rightPile[i] || leftPile[i - midPoint]);
                }

                this.cards = shuffled;

                // 动画效果：卡牌轻微上浮
                const animateUp = () => {
                    this.cards.forEach((card, index) => {
                        const offset = Math.sin(index * 0.5) * 10;
                        card.targetY = this.deckY - Math.abs(offset);
                        card.targetRotation = offset * 0.01;
                    });
                };

                const animateDown = () => {
                    this.cards.forEach(card => {
                        card.targetY = this.deckY;
                        card.targetRotation = 0;
                    });
                };

                animateUp();
                setTimeout(() => {
                    animateDown();
                    setTimeout(() => {
                        currentShuffle++;
                        doShuffle();
                    }, 150);
                }, 150);
            };

            doShuffle();
        });
    }

    // 重新排列卡牌
    reorderCards() {
        this.cards.forEach((card, index) => {
            card.x = this.deckX + (index % 5) * 0.5;
            card.y = this.deckY + Math.floor(index / 5) * 0.5;
            card.targetX = card.x;
            card.targetY = card.y;
            card.rotation = 0;
            card.targetRotation = 0;
        });
    }

    // 抽牌
    drawCard() {
        if (this.cards.length === 0) return null;

        // 获取一张未抽出的卡牌
        const availableCards = this.cards.filter(card => !this.drawnCards.includes(card));

        if (availableCards.length === 0) return null;

        // 随机选择一张
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];

        // 添加到已抽列表
        this.drawnCards.push(card);

        audioManager.play('deal');

        return card;
    }

    // 抽取指定数量的牌
    drawCards(count) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const card = this.drawCard();
            if (card) {
                cards.push(card);
            }
        }
        return cards;
    }

    // 将卡牌放回牌组
    returnCard(card) {
        const index = this.drawnCards.indexOf(card);
        if (index > -1) {
            this.drawnCards.splice(index, 1);
            card.moveTo(this.deckX, this.deckY);
            card.reset();
        }
    }

    // 将所有已抽出的牌放回
    returnAllCards() {
        this.drawnCards.forEach(card => {
            card.moveTo(this.deckX, this.deckY);
            card.reset();
        });
        this.drawnCards = [];
    }

    // 重置牌组
    reset() {
        this.returnAllCards();
        this.initDeck();
        this.setPosition(this.deckX, this.deckY);
    }

    // 获取已抽出的卡牌
    getDrawnCards() {
        return this.drawnCards;
    }

    // 获取剩余卡牌数量
    getRemainingCount() {
        return this.cards.length - this.drawnCards.length;
    }

    // 更新所有卡牌
    update(deltaTime) {
        this.cards.forEach(card => card.update(deltaTime));
    }

    // 渲染牌组
    render(ctx) {
        // 只渲染未抽出的卡牌（已抽出的由其他系统渲染）
        const undrawnCards = this.cards.filter(card => !this.drawnCards.includes(card));

        // 从底部到顶部渲染
        undrawnCards.forEach(card => {
            card.render(ctx);
        });

        // 如果有卡牌，渲染顶部的牌背装饰
        if (undrawnCards.length > 0) {
            this.renderTopCardDecoration(ctx);
        }
    }

    // 渲染顶部卡牌装饰
    renderTopCardDecoration(ctx) {
        const card = this.cards[0]; // 使用第一张牌的尺寸
        const halfWidth = card.width / 2;
        const halfHeight = card.height / 2;

        ctx.save();
        ctx.translate(this.deckX, this.deckY);

        // 添加轻微的发光
        ctx.shadowColor = CONFIG.colors.accent;
        ctx.shadowBlur = 10;

        // 绘制顶部边框高光
        ctx.strokeStyle = 'rgba(199, 125, 255, 0.3)';
        ctx.lineWidth = 2;
        canvasManager.drawRoundRect(
            ctx,
            -halfWidth,
            -halfHeight,
            card.width,
            card.height,
            card.cornerRadius
        );
        ctx.stroke();

        ctx.restore();
    }

    // 检测点击
    handleClick(x, y, allowDraw = true) {
        // 检查是否点击了牌组
        const card = this.cards[0];
        if (card && card.containsPoint(x, y)) {
            // 只有在允许抽牌时才真正抽牌
            if (allowDraw) {
                return this.drawCard();
            } else {
                // 不允许抽牌时，只返回第一张可用牌的引用，不实际抽取
                const availableCards = this.cards.filter(c => !this.drawnCards.includes(c));
                return availableCards.length > 0 ? availableCards[0] : null;
            }
        }
        return null;
    }

    // 检测悬停
    handleHover(x, y) {
        const card = this.cards[0];
        if (card) {
            const isHovered = card.containsPoint(x, y);
            card.setHovered(isHovered);
            return isHovered;
        }
        return false;
    }
}

// 导出到全局
window.TarotDeck = TarotDeck;
