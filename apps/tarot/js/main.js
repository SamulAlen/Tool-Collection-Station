// 塔罗占卜主控制器
class TarotApp {
    constructor() {
        this.state = 'welcome'; // welcome, spread-select, reading
        this.currentSpread = null;
        this.drawnCards = [];

        // 核心组件
        this.canvasManager = null;
        this.starField = null;
        this.magicParticles = null;
        this.deck = null;
        this.spreadManager = null;
        this.shuffleAnimator = null;
        this.interpretationManager = null;

        // 动画循环
        this.isRunning = false;
        this.lastTime = 0;

        // 解读面板状态
        this.interpretationScheduled = false;

        // 洗牌状态
        this.hasShuffled = false;

        // 解读完成状态
        this.readingComplete = false;

        // 抽牌动画状态
        this.isDrawing = false;

        // 初始化
        this.init();
    }

    // 初始化应用
    async init() {
        // 等待 DOM 加载
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // 初始化组件
        this.initComponents();

        // 绑定事件
        this.bindEvents();

        // 启动渲染循环
        this.start();
    }

    // 初始化组件
    initComponents() {
        // Canvas 管理器
        this.canvasManager = new CanvasManager();
        window.canvasManager = this.canvasManager;

        // 背景星空
        this.starField = new StarField();

        // 魔法粒子
        this.magicParticles = new MagicParticleSystem();
        window.magicParticles = this.magicParticles;

        // 牌阵管理器
        this.spreadManager = new SpreadManager();
        this.spreadManager.setLayoutSize(
            this.canvasManager.width,
            this.canvasManager.height
        );

        // 牌组（位置将在 setupReading 中根据牌阵位置计算）
        this.deck = new TarotDeck();
        this.updateDeckPosition();

        // 洗牌动画器
        this.shuffleAnimator = new ShuffleAnimator(this.deck);

        // 解读管理器
        this.interpretationManager = new InterpretationManager();

        // 生成牌阵选择界面
        this.generateSpreadSelector();
    }

    // 绑定事件
    bindEvents() {
        // 开始按钮
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showSpreadSelector();
            });
        }

        // 牌阵选择页面返回按钮
        const spreadBackBtn = document.getElementById('spread-back-btn');
        if (spreadBackBtn) {
            spreadBackBtn.addEventListener('click', () => this.goBackToWelcome());
        }

        // 返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }

        // 重置按钮
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetReading());
        }

        // 洗牌按钮
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.handleShuffle());
        }

        // 抽牌按钮
        const drawBtn = document.getElementById('draw-btn');
        if (drawBtn) {
            drawBtn.addEventListener('click', () => this.handleDraw());
        }

        // 关闭解读面板
        const closePanelBtn = document.getElementById('close-panel-btn');
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', () => this.closeInterpretationPanel());
        }

        // 音效切换
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound());
        }

        // Canvas 交互
        this.bindCanvasEvents();

        // 窗口大小改变
        window.addEventListener('canvasResize', (e) => {
            this.handleResize(e.detail.width, e.detail.height);
        });
    }

    // 绑定Canvas事件
    bindCanvasEvents() {
        const tarotCanvas = this.canvasManager.tarotCanvas;

        // 鼠标移动
        tarotCanvas.addEventListener('mousemove', (e) => {
            const pos = this.canvasManager.getPointerPosition(e);
            this.handleMouseMove(pos.x, pos.y);
        });

        // 点击
        tarotCanvas.addEventListener('click', (e) => {
            const pos = this.canvasManager.getPointerPosition(e);
            this.handleClick(pos.x, pos.y);
        });

        // 触摸事件
        tarotCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const pos = this.canvasManager.getPointerPosition(e);
            this.handleClick(pos.x, pos.y);
        });
    }

    // 处理鼠标移动
    handleMouseMove(x, y) {
        if (this.state === 'reading') {
            // 检测牌组悬停
            this.deck.handleHover(x, y);

            // 检测牌阵悬停
            this.spreadManager.handleHover(x, y);
        }
    }

    // 处理点击
    handleClick(x, y) {
        if (this.state === 'reading') {
            // 检测牌组点击（抽牌）- 只有洗牌后才能抽牌
            const canDraw = this.hasShuffled && this.shouldDrawCard();
            const card = this.deck.handleClick(x, y, canDraw);
            if (card && canDraw) {
                this.drawCard(card);
            }

            // 检测牌阵点击（翻牌）
            const spreadClick = this.spreadManager.handleClick(x, y);
            if (spreadClick) {
                this.flipCard(spreadClick.card, spreadClick.index);
            }
        }
    }

    // 显示牌阵选择界面
    showSpreadSelector() {
        // 初始化音效
        audioManager.init();

        this.state = 'spread-select';
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('spread-selector').style.display = 'flex';
    }

    // 生成牌阵选择器
    generateSpreadSelector() {
        const spreadGrid = document.getElementById('spread-grid');
        if (!spreadGrid) return;

        const spreads = new SpreadSelector().getAllSpreads();

        spreadGrid.innerHTML = spreads.map(spread => `
            <div class="spread-card" data-spread="${spread.id}">
                <div class="spread-icon">
                    ${this.getSpreadIcon(spread.id)}
                </div>
                <h3 class="spread-name">${spread.name}</h3>
                <p class="spread-name-en">${spread.nameEn}</p>
                <p class="spread-description">${spread.description}</p>
                <p class="spread-card-count">${spread.cardCount} 张牌</p>
            </div>
        `).join('');

        // 绑定点击事件
        spreadGrid.querySelectorAll('.spread-card').forEach(card => {
            card.addEventListener('click', () => {
                const spreadId = card.dataset.spread;
                this.selectSpread(spreadId);
            });
        });
    }

    // 获取牌阵图标
    getSpreadIcon(spreadId) {
        const icons = {
            single: '●',
            three: '●○●',
            celtic: '✛',
            horseshoe: '⋃',
            star: '✦',
            relationship: '♥',
            daily: '☀',
            choice: '◐'
        };
        return icons[spreadId] || '●';
    }

    // 选择牌阵
    selectSpread(spreadId) {
        this.currentSpread = spreadId;
        this.spreadManager.selectSpread(spreadId);

        document.getElementById('spread-selector').style.display = 'none';
        document.getElementById('reading-container').style.display = 'flex';

        // 更新标题 - 移除多余的"占卜"二字
        const spread = CONFIG.spreads[spreadId];
        document.getElementById('reading-title').textContent = spread.name;

        this.state = 'reading';
        this.setupReading();
    }

    // 设置占卜
    setupReading() {
        // 解除抽牌锁定
        this.isDrawing = false;

        // 重置牌组
        this.deck.reset();
        this.drawnCards = [];
        this.spreadManager.reset();

        // 重置洗牌状态
        this.hasShuffled = false;

        // 重置解读完成状态
        this.readingComplete = false;

        // 更新牌组位置（在牌阵下方）
        this.updateDeckPosition();

        // 隐藏解读面板
        document.getElementById('interpretation-panel').style.display = 'none';

        // 更新抽牌按钮 - 初始状态显示正确的牌数，但禁用（需先洗牌）
        this.updateDrawButton();
        document.getElementById('draw-btn').disabled = true;

        // 显示卡牌操作区
        document.getElementById('card-actions').style.display = 'flex';
    }

    // 更新牌组位置
    updateDeckPosition() {
        // 先计算牌阵布局，获取牌组应该在的位置
        this.spreadManager.calculateLayoutArea();

        // 如果牌阵管理器计算出了牌组位置（且已选择牌阵），使用它
        if (this.spreadManager.currentSpread && this.spreadManager.deckPositionY !== undefined) {
            this.deck.setPosition(
                this.canvasManager.width / 2,
                this.spreadManager.deckPositionY
            );
        } else {
            // 默认位置（屏幕中下方）
            this.deck.setPosition(
                this.canvasManager.width / 2,
                this.canvasManager.height * 0.65
            );
        }
    }

    // 处理洗牌
    async handleShuffle() {
        if (this.shuffleAnimator.isAnimating) return;

        // 如果已经开始抽牌，不允许洗牌
        if (this.drawnCards.length > 0) {
            return;
        }

        // 禁用按钮
        this.setButtonsEnabled(false);

        // 执行洗牌
        await this.shuffleAnimator.magicShuffle();

        // 标记已洗牌
        this.hasShuffled = true;

        // 启用抽牌按钮
        document.getElementById('draw-btn').disabled = false;

        // 启用按钮
        this.setButtonsEnabled(true);
    }

    // 处理抽牌
    async handleDraw() {
        // 防止并发抽牌
        if (this.isDrawing) {
            return;
        }

        // 检查是否已洗牌
        if (!this.hasShuffled) {
            return;
        }

        if (!this.shouldDrawCard()) {
            return;
        }

        const card = this.deck.drawCard();
        if (card) {
            await this.drawCard(card);
        }
    }

    // 抽牌
    async drawCard(card) {
        // 标记正在抽牌
        this.isDrawing = true;

        try {
            this.drawnCards.push(card);

            // 将卡牌添加到牌阵管理器
            this.spreadManager.spreadCards.push(card);

            // 计算当前卡牌在牌阵中的位置
            const spread = this.spreadManager.currentSpread;
            const positionIndex = this.drawnCards.length - 1;
            const positions = this.spreadManager.calculatePositions();
            const position = positions[positionIndex];

            // 立即将卡牌移动到牌阵位置
            card.moveTo(position.x, position.y);
            card.rotateTo(position.rotation || 0);

            // 更新按钮
            this.updateDrawButton();

            // 抽牌后禁用洗牌按钮
            document.getElementById('shuffle-btn').disabled = true;

            // 播放音效
            audioManager.play('deal');

            // 触发粒子效果
            if (window.magicParticles) {
                window.magicParticles.burst(
                    position.x,
                    position.y,
                    10,
                    { colors: ['#FFD700', '#C77DFF'] }
                );
            }

            // 等待一小段时间让动画完成
            await new Promise(resolve => setTimeout(resolve, 300));

            // 检查是否抽完
            if (spread && this.drawnCards.length === spread.cardCount) {
                // 显示完成提示
                this.showReadingComplete();
            }
        } finally {
            // 无论成功失败，都解除抽牌锁定
            this.isDrawing = false;
        }
    }

    // 放置卡牌到牌阵（已弃用，现在每张牌抽完后立即放置）
    async placeCards() {
        // 这个方法已经不再使用，因为现在抽牌时直接放置
        // 保留空方法以防万一
    }

    // 翻牌
    flipCard(card, index) {
        if (!card.isFaceUp) {
            card.flip();
            // 等待翻转动画完成后再检查（700ms 是翻转动画的时长）
            setTimeout(() => {
                this.checkAllRevealed();
            }, 700);
        }
    }

    // 检查是否所有牌都已翻开
    checkAllRevealed() {
        // 只有在抽完所有牌后才检查
        const spread = this.spreadManager.currentSpread;
        if (!spread || this.drawnCards.length < spread.cardCount) {
            return;
        }

        const allRevealed = this.drawnCards.every(card => card.isFaceUp);

        if (allRevealed && !this.interpretationScheduled) {
            // 标记已安排解读生成，防止重复调用
            this.interpretationScheduled = true;

            // 所有牌翻开后，稍等片刻再生成解读
            setTimeout(() => {
                this.generateInterpretation();
            }, 800);
        }
    }

    // 生成解读
    generateInterpretation() {
        const reading = this.interpretationManager.generateInterpretation(
            this.drawnCards,
            this.spreadManager.currentSpread
        );

        // 显示解读面板
        this.showInterpretationPanel(reading);
    }

    // 关闭解读面板
    closeInterpretationPanel() {
        const panel = document.getElementById('interpretation-panel');

        // 添加滑出动画 - 使用更长的过渡时间和更流畅的缓动函数
        panel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.style.transform = 'translateX(100%)';

        // 动画完成后隐藏面板并显示重新打开按钮
        setTimeout(() => {
            panel.style.display = 'none';
            panel.style.transform = ''; // 重置 transform
            this.showReopenButton();
        }, 600);

        // 取消高亮
        this.drawnCards.forEach(card => {
            card.isSelected = false;
            card.glowIntensity = 0;
        });
    }

    // 显示重新打开按钮
    showReopenButton() {
        let reopenBtn = document.getElementById('reopen-panel-btn');
        if (!reopenBtn) {
            reopenBtn = document.createElement('button');
            reopenBtn.id = 'reopen-panel-btn';
            reopenBtn.className = 'reopen-panel-btn';
            reopenBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            `;
            reopenBtn.addEventListener('click', () => this.reopenInterpretationPanel());
            document.body.appendChild(reopenBtn);
        }
        reopenBtn.style.display = 'flex';
    }

    // 隐藏重新打开按钮
    hideReopenButton() {
        const reopenBtn = document.getElementById('reopen-panel-btn');
        if (reopenBtn) {
            reopenBtn.style.display = 'none';
        }
    }

    // 重新打开解读面板
    reopenInterpretationPanel() {
        const panel = document.getElementById('interpretation-panel');

        // 先显示面板
        panel.style.display = 'block';

        // 添加滑入动画 - 使用更长的过渡时间和更流畅的缓动函数
        panel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.style.transform = 'translateX(0)';

        // 隐藏重新打开按钮
        this.hideReopenButton();
    }

    // 显示占卜完成
    showReadingComplete() {
        const drawText = document.getElementById('draw-text');
        drawText.textContent = '点击卡牌翻牌';
        document.getElementById('draw-btn').disabled = true;
    }

    // 显示解读面板时标记完成并禁用洗牌
    showInterpretationPanel(reading) {
        // 标记解读完成
        this.readingComplete = true;

        // 禁用洗牌按钮（解读完成后只能重置）
        document.getElementById('shuffle-btn').disabled = true;

        const panel = document.getElementById('interpretation-panel');
        const content = document.getElementById('panel-content');

        content.innerHTML = this.interpretationManager.formatAsHTML(reading);

        // 先显示面板
        panel.style.display = 'block';

        // 添加滑入动画 - 使用更长的过渡时间和更流畅的缓动函数
        panel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.style.transform = 'translateX(0)';

        // 隐藏重新打开按钮
        this.hideReopenButton();

        // 绑定卡牌点击事件
        content.querySelectorAll('.card-reading').forEach((elem, index) => {
            elem.addEventListener('click', () => {
                this.highlightCard(index);
            });
        });
    }

    // 更新抽牌按钮
    updateDrawButton() {
        const drawBtn = document.getElementById('draw-btn');
        const drawText = document.getElementById('draw-text');

        // 获取当前牌阵需要的卡牌数量
        const spread = this.spreadManager.currentSpread;
        const totalCards = spread ? spread.cardCount : 3;

        drawText.textContent = `抽牌 (${this.drawnCards.length}/${totalCards})`;

        if (this.drawnCards.length >= totalCards) {
            drawBtn.disabled = true;
        } else {
            drawBtn.disabled = false; // 但洗牌后才能抽
        }
    }

    // 是否应该抽牌
    shouldDrawCard() {
        const spread = this.spreadManager.currentSpread;
        if (!spread) return false;
        return this.drawnCards.length < spread.cardCount;
    }

    // 设置按钮状态
    setButtonsEnabled(enabled) {
        document.querySelectorAll('.action-btn, .nav-btn').forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    // 返回到欢迎页
    goBackToWelcome() {
        if (this.state === 'spread-select') {
            this.state = 'welcome';
            document.getElementById('spread-selector').style.display = 'none';
            document.getElementById('welcome-screen').style.display = 'flex';
        }
    }

    // 返回
    goBack() {
        if (this.state === 'reading') {
            this.resetReading();
            this.state = 'spread-select';
            document.getElementById('reading-container').style.display = 'none';
            document.getElementById('spread-selector').style.display = 'flex';
        }
    }

    // 重置占卜
    resetReading() {
        // 解除抽牌锁定（防止重置时正在抽牌导致状态不一致）
        this.isDrawing = false;

        this.deck.reset();
        this.drawnCards = [];
        this.spreadManager.reset();

        // 重置解读标志
        this.interpretationScheduled = false;

        // 重置解读完成状态
        this.readingComplete = false;

        // 隐藏解读面板和重新打开按钮
        document.getElementById('interpretation-panel').style.display = 'none';
        this.hideReopenButton();

        // 重新显示操作区并更新按钮状态
        document.getElementById('card-actions').style.display = 'flex';

        // 重置抽牌按钮
        const drawBtn = document.getElementById('draw-btn');
        const drawText = document.getElementById('draw-text');

        // 获取当前牌阵需要的卡牌数量
        const totalCards = this.spreadManager.currentSpread ? this.spreadManager.currentSpread.cardCount : 3;
        drawText.textContent = `抽牌 (0/${totalCards})`;
        drawBtn.disabled = true; // 需要先洗牌才能抽牌

        // 重置洗牌按钮状态
        document.getElementById('shuffle-btn').disabled = false;
    }

    // 切换音效
    toggleSound() {
        const enabled = audioManager.toggle();
        const iconOn = document.getElementById('sound-icon-on');
        const iconOff = document.getElementById('sound-icon-off');

        if (enabled) {
            iconOn.style.display = 'block';
            iconOff.style.display = 'none';
        } else {
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
        }
    }

    // 处理窗口大小改变
    handleResize(width, height) {
        if (this.starField) {
            this.starField.reset();
        }

        if (this.spreadManager) {
            this.spreadManager.setLayoutSize(width, height);
        }

        if (this.deck) {
            this.updateDeckPosition();
        }
    }

    // 启动渲染循环
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.render(t));
    }

    // 渲染循环
    render(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 清除画布
        this.canvasManager.clearAll();

        // 渲染背景层
        this.renderBackground();

        // 渲染塔罗层
        this.renderTarot(deltaTime);

        // 渲染覆盖层
        this.renderOverlay();

        requestAnimationFrame((t) => this.render(t));
    }

    // 渲染背景
    renderBackground() {
        const ctx = this.canvasManager.bgCtx;
        const { width, height } = this.canvasManager;

        // 更新和渲染星空
        this.starField.update();
        this.starField.render(ctx, width, height);
    }

    // 渲染塔罗层
    renderTarot(deltaTime) {
        const ctx = this.canvasManager.tarotCtx;

        // 更新组件
        if (this.magicParticles) {
            this.magicParticles.update();
        }

        if (this.deck) {
            this.deck.update(deltaTime);
        }

        if (this.spreadManager) {
            this.spreadManager.update(deltaTime);
        }

        // 渲染组件
        if (this.state === 'reading') {
            // 渲染牌组
            if (this.deck) {
                this.deck.render(ctx);
            }

            // 渲染牌阵
            if (this.spreadManager) {
                this.spreadManager.render(ctx);
            }
        }

        // 渲染粒子
        if (this.magicParticles) {
            this.magicParticles.render(ctx);
        }
    }

    // 渲染覆盖层
    renderOverlay() {
        // 可以在这里添加UI覆盖元素
    }
}

// 创建全局应用实例
let tarotApp;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    tarotApp = new TarotApp();
});

// 导出到全局
window.TarotApp = TarotApp;
