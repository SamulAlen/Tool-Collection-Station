// 牌阵布局系统
class SpreadManager {
    constructor() {
        this.currentSpread = null;
        this.spreadCards = [];
        this.cardPositions = [];

        // 布局配置
        this.layout = {
            width: 0,
            height: 0,
            padding: 20,
            cardSpacing: 30
        };

        // 循环点击状态：记录上次点击的位置和索引
        this.lastClickState = {
            x: 0,
            y: 0,
            cardIndex: -1,
            timestamp: 0
        };
    }

    // 设置布局尺寸
    setLayoutSize(width, height) {
        this.layout.width = width;
        this.layout.height = height;
    }

    // 选择牌阵
    selectSpread(spreadId) {
        const spread = CONFIG.spreads[spreadId];
        if (!spread) {
            return false;
        }

        this.currentSpread = spread;
        this.spreadCards = [];
        this.cardPositions = [];

        return true;
    }

    // 获取当前牌阵
    getCurrentSpread() {
        return this.currentSpread;
    }

    // 计算牌阵位置
    calculatePositions() {
        if (!this.currentSpread) return [];

        const positions = [];
        const spread = this.currentSpread;

        // 计算布局区域
        const layoutArea = this.calculateLayoutArea();

        spread.positions.forEach((pos, index) => {
            const x = layoutArea.x + pos.x * layoutArea.width;
            const y = layoutArea.y + pos.y * layoutArea.height;
            const rotation = pos.rotate || 0;

            positions.push({
                index,
                name: pos.name,
                x,
                y,
                rotation
            });
        });

        this.cardPositions = positions;
        return positions;
    }

    // 计算布局区域
    calculateLayoutArea() {
        const spread = this.currentSpread;

        // 如果没有选择牌阵，返回默认区域
        if (!spread) {
            return {
                x: 0,
                y: 0,
                width: this.layout.width,
                height: this.layout.height
            };
        }

        const cardWidth = CONFIG.card.width;
        const cardHeight = CONFIG.card.height;
        const padding = this.layout.padding;
        const spacing = this.layout.cardSpacing;

        // 顶部导航栏高度
        const topBarHeight = 70;

        // 固定间距：三个区域之间各 60px（从 80px 减小）
        const sectionGap = 60;

        // 牌阵位置：在导航栏下方 + 间距
        const spreadAreaY = topBarHeight + sectionGap;

        // 根据牌阵类型计算区域
        let areaWidth, areaHeight, areaX, areaY;

        if (spread.cardCount <= 3) {
            // 小牌阵 - 固定一张牌的高度
            areaWidth = cardWidth * spread.cardCount + spacing * (spread.cardCount - 1);
            areaHeight = cardHeight;
        } else if (spread.cardCount <= 7) {
            // 中牌阵 - 减小高度，让牌阵更靠上
            areaWidth = Math.min(this.layout.width - padding * 2, cardWidth * 4 + spacing * 3);
            areaHeight = cardHeight * 2 + spacing; // 从 3 行改为 2 行
        } else {
            // 大牌阵 - 减小高度，让牌阵更靠上
            areaWidth = Math.min(this.layout.width - padding * 2, cardWidth * 5 + spacing * 4);
            areaHeight = cardHeight * 2.5 + spacing; // 从 4 行改为 2.5 行
        }

        // 水平居中，垂直固定在导航栏下方
        areaX = (this.layout.width - areaWidth) / 2;
        areaY = spreadAreaY;

        // 计算牌阵中最下方的卡牌底部位置
        // 找出所有位置中 y 值最大的
        let maxY = 0;
        spread.positions.forEach(pos => {
            const cardBottomY = spreadAreaY + pos.y * areaHeight + cardHeight / 2;
            if (cardBottomY > maxY) {
                maxY = cardBottomY;
            }
        });

        // 存储牌组位置：最下方卡牌底部 + 间距 + 半张牌高度（使牌组中心对齐）
        this.deckPositionY = maxY + sectionGap + cardHeight / 2;

        return {
            x: areaX,
            y: areaY,
            width: areaWidth,
            height: areaHeight
        };
    }

    // 将卡牌放置到牌阵位置
    async placeCards(cards) {
        if (!this.currentSpread) {
            return;
        }

        this.spreadCards = cards;
        const positions = this.calculatePositions();

        // 逐个放置卡牌
        for (let i = 0; i < cards.length && i < positions.length; i++) {
            await this.placeCard(cards[i], positions[i], i);
        }
    }

    // 放置单张卡牌
    async placeCard(card, position, index) {
        const duration = 400;

        return new Promise(resolve => {
            setTimeout(() => {
                audioManager.play('deal');

                // 粒子效果
                if (window.magicParticles) {
                    window.magicParticles.burst(
                        position.x,
                        position.y,
                        10,
                        { colors: ['#FFD700', '#C77DFF'] }
                    );
                }

                card.moveTo(position.x, position.y);
                card.rotateTo(position.rotation);

                setTimeout(resolve, duration);
            }, index * 150);
        });
    }

    // 翻开所有卡牌
    async revealAll() {
        for (let i = 0; i < this.spreadCards.length; i++) {
            await this.revealCard(i);
        }
    }

    // 翻开指定位置的卡牌
    async revealCard(index) {
        if (index >= 0 && index < this.spreadCards.length) {
            const card = this.spreadCards[index];
            if (!card.isFaceUp) {
                card.flip();
                await this.delay(600);
            }
        }
    }

    // 延迟
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 渲染牌阵
    render(ctx) {
        // 渲染已放置的卡牌
        this.spreadCards.forEach(card => {
            card.render(ctx);
        });

        // 渲染位置标记
        this.renderPositionMarkers(ctx);
    }

    // 渲染位置标记
    renderPositionMarkers(ctx) {
        if (!this.currentSpread) return;

        const positions = this.calculatePositions();

        ctx.save();

        positions.forEach(pos => {
            // 检查该位置是否已有卡牌
            const hasCard = this.spreadCards.length > pos.index;

            if (!hasCard) {
                // 绘制空位置标记
                this.renderEmptyPosition(ctx, pos);
            } else {
                // 绘制位置标签
                this.renderPositionLabel(ctx, pos);
            }
        });

        ctx.restore();
    }

    // 渲染空位置
    renderEmptyPosition(ctx, position) {
        const cardWidth = CONFIG.card.width;
        const cardHeight = CONFIG.card.height;
        const halfWidth = cardWidth / 2;
        const halfHeight = cardHeight / 2;

        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(position.rotation);

        // 绘制虚线边框
        ctx.strokeStyle = 'rgba(157, 78, 221, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        canvasManager.drawRoundRect(
            ctx,
            -halfWidth,
            -halfHeight,
            cardWidth,
            cardHeight,
            CONFIG.card.cornerRadius
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制位置名称
        ctx.fillStyle = 'rgba(157, 78, 221, 0.5)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(position.name, 0, 0);

        ctx.restore();
    }

    // 渲染位置标签
    renderPositionLabel(ctx, position) {
        const cardHeight = CONFIG.card.height;

        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(position.rotation);

        // 在卡牌下方绘制位置名称
        ctx.fillStyle = 'rgba(199, 125, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // 标签背景
        const text = position.name;
        const textWidth = ctx.measureText(text).width;
        ctx.fillStyle = 'rgba(26, 10, 46, 0.8)';
        ctx.fillRect(
            -textWidth / 2 - 5,
            cardHeight / 2 + 5,
            textWidth + 10,
            18
        );

        // 标签文字
        ctx.fillStyle = '#C77DFF';
        ctx.fillText(text, 0, cardHeight / 2 + 8);

        ctx.restore();
    }

    // 获取卡牌在牌阵中的位置
    getCardPosition(index) {
        if (index >= 0 && index < this.cardPositions.length) {
            return this.cardPositions[index];
        }
        return null;
    }

    // 获取所有卡牌位置
    getAllCardPositions() {
        return this.cardPositions;
    }

    // 重置牌阵
    reset() {
        // 不重置 currentSpread，只重置卡牌和位置
        // this.currentSpread = null; // 注释掉这行
        this.spreadCards = [];
        this.cardPositions = [];

        // 重置点击状态
        this.lastClickState = { x: 0, y: 0, cardIndex: -1, timestamp: 0 };
    }

    // 更新卡牌
    update(deltaTime) {
        this.spreadCards.forEach(card => card.update(deltaTime));
    }

    // 检测点击（支持循环点击被遮挡的牌）
    handleClick(x, y) {
        const now = Date.now();
        const clickThreshold = 500; // 500ms 内的点击认为是连续点击
        const positionThreshold = 20; // 20px 内的点击认为是同一位置

        // 找出所有包含该点的牌（从后往前，最上层在前）
        const clickedCards = [];
        for (let i = this.spreadCards.length - 1; i >= 0; i--) {
            const card = this.spreadCards[i];
            if (card.containsPoint(x, y)) {
                clickedCards.push({ card, index: i, position: this.cardPositions[i] });
            }
        }

        // 没有点击到任何牌
        if (clickedCards.length === 0) {
            this.lastClickState = { x: 0, y: 0, cardIndex: -1, timestamp: 0 };
            return null;
        }

        // 只有一张牌，直接返回
        if (clickedCards.length === 1) {
            this.lastClickState = { x, y, cardIndex: clickedCards[0].index, timestamp: now };
            return clickedCards[0];
        }

        // 多张牌重叠，检查是否是连续点击同一位置
        const isSamePosition =
            Math.abs(x - this.lastClickState.x) < positionThreshold &&
            Math.abs(y - this.lastClickState.y) < positionThreshold;

        const isRecentClick = (now - this.lastClickState.timestamp) < clickThreshold;

        if (isSamePosition && isRecentClick) {
            // 连续点击同一位置，返回下一张牌
            const lastIndex = clickedCards.findIndex(c => c.index === this.lastClickState.cardIndex);
            const nextIndex = (lastIndex + 1) % clickedCards.length;
            this.lastClickState = { x, y, cardIndex: clickedCards[nextIndex].index, timestamp: now };
            return clickedCards[nextIndex];
        } else {
            // 新的点击位置，返回最上层的牌
            this.lastClickState = { x, y, cardIndex: clickedCards[0].index, timestamp: now };
            return clickedCards[0];
        }
    }

    // 检测悬停（从后往前遍历，确保最上层的卡牌优先响应）
    handleHover(x, y) {
        // 先清除所有卡牌的悬停状态
        for (const card of this.spreadCards) {
            card.setHovered(false);
        }

        // 找出所有包含该点的牌
        const hoveredCards = [];
        for (let i = this.spreadCards.length - 1; i >= 0; i--) {
            const card = this.spreadCards[i];
            if (card.containsPoint(x, y)) {
                hoveredCards.push(card);
            }
        }

        // 如果有牌被悬停，让最上层的牌显示悬停效果
        if (hoveredCards.length > 0) {
            hoveredCards[0].setHovered(true);
        }
    }
}

// 牌阵选择器
class SpreadSelector {
    constructor() {
        this.spreads = CONFIG.spreads;
    }

    // 获取所有牌阵
    getAllSpreads() {
        return Object.entries(this.spreads).map(([id, spread]) => ({
            id,
            ...spread
        }));
    }

    // 获取推荐牌阵
    getRecommendedSpreads() {
        return ['single', 'three', 'celtic', 'daily'].map(id => ({
            id,
            ...this.spreads[id],
            recommended: true
        }));
    }

    // 根据卡牌数量获取适合的牌阵
    getSpreadsForCardCount(count) {
        return Object.entries(this.spreads)
            .filter(([id, spread]) => spread.cardCount === count)
            .map(([id, spread]) => ({ id, ...spread }));
    }

    // 获取牌阵详情
    getSpreadDetails(spreadId) {
        return this.spreads[spreadId];
    }
}

// 导出到全局
window.SpreadManager = SpreadManager;
window.SpreadSelector = SpreadSelector;
