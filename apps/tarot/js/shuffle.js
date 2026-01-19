// 洗牌动画系统
class ShuffleAnimator {
    constructor(deck) {
        this.deck = deck;
        this.isAnimating = false;
        this.animationType = 'basic'; // basic, spread, fan, ribbon
    }

    // 设置动画类型
    setAnimationType(type) {
        this.animationType = type;
    }

    // 开始洗牌动画
    async start() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        switch(this.animationType) {
            case 'basic':
                await this.basicShuffle();
                break;
            case 'spread':
                await this.spreadShuffle();
                break;
            case 'fan':
                await this.fanShuffle();
                break;
            case 'ribbon':
                await this.ribbonShuffle();
                break;
        }

        this.isAnimating = false;
    }

    // 基础洗牌动画
    async basicShuffle() {
        audioManager.play('shuffle');

        // 粒子效果
        if (window.magicParticles) {
            window.magicParticles.createShuffleEffect(
                this.deck.deckX,
                this.deck.deckY
            );
        }

        // 卡牌上下移动
        const duration = 1000;
        const startTime = Date.now();

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const cycle = Math.sin(progress * Math.PI * 4);

                this.deck.cards.forEach((card, index) => {
                    const offset = Math.sin(index * 0.3 + elapsed * 0.01) * 15;
                    card.targetY = this.deck.deckY - Math.abs(offset);
                    card.targetRotation = offset * 0.02;
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 回到原位
                    this.deck.cards.forEach(card => {
                        card.targetY = this.deck.deckY;
                        card.targetRotation = 0;
                    });
                    setTimeout(resolve, 200);
                }
            };

            animate();
        });
    }

    // 展开洗牌动画
    async spreadShuffle() {
        audioManager.play('shuffle');

        const centerX = this.deck.deckX;
        const centerY = this.deck.deckY;
        const spreadWidth = 300;

        // 展开阶段
        await this.spreadCards(centerX, centerY, spreadWidth);

        // 收集阶段
        await this.gatherCards(centerX, centerY);

        // 洗牌阶段
        await this.basicShuffle();
    }

    // 展开卡牌
    async spreadCards(centerX, centerY, width) {
        const duration = 600;
        const startTime = Date.now();

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = Easing.easeOutQuad(progress);

                this.deck.cards.forEach((card, index) => {
                    const normalizedIndex = index / (this.deck.cards.length - 1);
                    const targetX = centerX + (normalizedIndex - 0.5) * width;
                    const targetY = centerY + Math.sin(normalizedIndex * Math.PI) * 20;

                    card.targetX = centerX + (targetX - centerX) * eased;
                    card.targetY = centerY + (targetY - centerY) * eased;
                    card.targetRotation = (normalizedIndex - 0.5) * 0.3 * eased;
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(resolve, 100);
                }
            };

            animate();
        });
    }

    // 收集卡牌
    async gatherCards(centerX, centerY) {
        const duration = 400;
        const startTime = Date.now();

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = Easing.easeInQuad(progress);

                this.deck.cards.forEach(card => {
                    card.targetX = centerX + (card.targetX - centerX) * (1 - eased);
                    card.targetY = centerY + (card.targetY - centerY) * (1 - eased);
                    card.targetRotation = card.targetRotation * (1 - eased);
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

    // 扇形洗牌动画
    async fanShuffle() {
        audioManager.play('shuffle');

        const centerX = this.deck.deckX;
        const centerY = this.deck.deckY;
        const fanAngle = Math.PI * 0.8;
        const fanRadius = 150;

        // 展开成扇形
        await this.fanCards(centerX, centerY, fanAngle, fanRadius);

        // 收集
        await this.gatherCards(centerX, centerY);

        // 基础洗牌
        await this.basicShuffle();
    }

    // 扇形展开卡牌
    async fanCards(centerX, centerY, angle, radius) {
        const duration = 800;
        const startTime = Date.now();

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = Easing.easeOutBack(progress);

                this.deck.cards.forEach((card, index) => {
                    const normalizedIndex = index / (this.deck.cards.length - 1);
                    const cardAngle = -angle / 2 + normalizedIndex * angle;

                    const targetX = centerX + Math.sin(cardAngle) * radius * eased;
                    const targetY = centerY - Math.cos(cardAngle) * radius * 0.3 * eased;
                    const targetRotation = cardAngle * eased;

                    card.targetX = targetX;
                    card.targetY = targetY;
                    card.targetRotation = targetRotation;
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(resolve, 200);
                }
            };

            animate();
        });
    }

    // 丝带洗牌动画
    async ribbonShuffle() {
        audioManager.play('shuffle');

        const centerX = this.deck.deckX;
        const centerY = this.deck.deckY;

        // 创建波浪效果
        await this.ribbonWave(centerX, centerY);

        // 收集
        await this.gatherCards(centerX, centerY);

        // 基础洗牌
        await this.basicShuffle();
    }

    // 波浪效果
    async ribbonWave(centerX, centerY) {
        const duration = 1200;
        const startTime = Date.now();
        const waveAmplitude = 50;
        const waveLength = 200;

        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.deck.cards.forEach((card, index) => {
                    const normalizedIndex = index / (this.deck.cards.length - 1);
                    const baseX = centerX + (normalizedIndex - 0.5) * 300;

                    // 波浪运动
                    const waveOffset = Math.sin(
                        (normalizedIndex * waveLength + elapsed * 0.01) * 0.05
                    ) * waveAmplitude * (1 - progress * 0.5);

                    card.targetX = baseX;
                    card.targetY = centerY + waveOffset;
                    card.targetRotation = Math.cos(
                        (normalizedIndex * waveLength + elapsed * 0.01) * 0.05
                    ) * 0.2;
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

    // 快速洗牌（用于开始占卜时）
    async quickShuffle() {
        const originalType = this.animationType;
        this.animationType = 'basic';

        await this.start();

        this.animationType = originalType;
    }

    // 魔法洗牌（带特效）
    async magicShuffle() {
        if (window.magicParticles) {
            // 创建环绕粒子
            window.magicParticles.createEmitter(
                'shuffle-magic-' + Date.now(),
                this.deck.deckX,
                this.deck.deckY,
                {
                    rate: 40,
                    duration: 2000,
                    spread: 100,
                    direction: 'up',
                    particleOptions: {
                        colors: ['#9D4EDD', '#C77DFF', '#FFD700'],
                        gravity: 0.02
                    }
                }
            );
        }

        audioManager.play('magic');

        // 执行扇形洗牌
        await this.fanShuffle();
    }

    // 是否正在动画
    isAnimating() {
        return this.isAnimating;
    }
}

// 洗牌变体选择器
class ShuffleSelector {
    constructor() {
        this.types = [
            { id: 'basic', name: '基础洗牌', description: '简单快速的洗牌方式' },
            { id: 'spread', name: '展开洗牌', description: '展开后收集的优雅洗牌' },
            { id: 'fan', name: '扇形洗牌', description: '展开成扇形的洗牌方式' },
            { id: 'ribbon', name: '波浪洗牌', description: '波浪流动的洗牌方式' }
        ];
        this.currentType = 'basic';
    }

    // 获取所有类型
    getTypes() {
        return this.types;
    }

    // 设置当前类型
    setCurrentType(type) {
        if (this.types.find(t => t.id === type)) {
            this.currentType = type;
        }
    }

    // 获取当前类型
    getCurrentType() {
        return this.currentType;
    }

    // 获取当前类型信息
    getCurrentTypeInfo() {
        return this.types.find(t => t.id === this.currentType);
    }
}

// 导出到全局
window.ShuffleAnimator = ShuffleAnimator;
window.ShuffleSelector = ShuffleSelector;
