// 塔罗牌类 - 卡牌绘制和动画
class TarotCard {
    constructor(cardData, x, y) {
        this.data = cardData;

        // 位置属性
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;

        // 卡牌尺寸
        this.width = CONFIG.card.width;
        this.height = CONFIG.card.height;
        this.cornerRadius = CONFIG.card.cornerRadius;

        // 状态
        this.isFaceUp = false;
        this.isFlipping = false;
        this.flipProgress = 0;

        // 动画属性
        this.scale = 1;
        this.targetScale = 1;
        this.rotation = 0;
        this.targetRotation = 0;
        this.opacity = 1;
        this.glowIntensity = 0;

        // 交互状态
        this.isHovered = false;
        this.isSelected = false;
        this.isDragging = false;

        // 动画队列
        this.animations = [];
    }

    // 更新卡牌
    update(deltaTime) {
        // 位置插值
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;

        // 缩放插值
        this.scale += (this.targetScale - this.scale) * 0.1;

        // 旋转插值
        this.rotation += (this.targetRotation - this.rotation) * 0.1;

        // 翻牌动画
        if (this.isFlipping) {
            this.flipProgress += deltaTime * 0.003;
            if (this.flipProgress >= 1) {
                this.flipProgress = 1;
                this.isFlipping = false;
                this.isFaceUp = !this.isFaceUp;
            }
        }

        // 发光强度衰减
        if (this.glowIntensity > 0) {
            this.glowIntensity -= deltaTime * 0.001;
            if (this.glowIntensity < 0) this.glowIntensity = 0;
        }

        // 悬停效果
        if (this.isHovered && !this.isDragging) {
            this.targetScale = CONFIG.card.hoverScale;
        } else if (!this.isSelected) {
            this.targetScale = 1;
        }

        // 选中效果
        if (this.isSelected) {
            this.targetScale = CONFIG.card.selectedScale;
            this.glowIntensity = 0.8;
        }
    }

    // 渲染卡牌
    render(ctx) {
        ctx.save();

        // 应用变换
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // 计算翻牌时的缩放
        let scaleX = 1;
        if (this.isFlipping) {
            scaleX = Math.cos(this.flipProgress * Math.PI);
        }

        // 判断当前面
        const showFace = this.isFaceUp;
        const isBackVisible = (this.isFlipping && this.flipProgress < 0.5) || (!this.isFaceUp && !this.isFlipping);

        ctx.scale(scaleX, 1);

        // 绘制阴影
        this.drawShadow(ctx);

        // 绘制发光效果
        if (this.glowIntensity > 0) {
            this.drawGlow(ctx);
        }

        // 绘制卡牌
        if (isBackVisible) {
            this.drawBack(ctx);
        } else {
            this.drawFace(ctx);
        }

        ctx.restore();
    }

    // 绘制阴影
    drawShadow(ctx) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        canvasManager.drawRoundRect(
            ctx,
            -this.width / 2 + 2,
            -this.height / 2 + 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        ctx.fill();
        ctx.restore();
    }

    // 绘制发光
    drawGlow(ctx) {
        ctx.save();
        ctx.shadowColor = CONFIG.colors.primary;
        ctx.shadowBlur = 20 * this.glowIntensity;
        canvasManager.drawRoundRect(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        ctx.strokeStyle = `rgba(157, 78, 221, ${this.glowIntensity})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    // 绘制牌背
    drawBack(ctx) {
        // 背景
        ctx.fillStyle = CONFIG.colors.cardBack;
        canvasManager.drawRoundRect(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        ctx.fill();

        // 边框
        ctx.strokeStyle = CONFIG.colors.cardBackPattern;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制神秘图案
        this.drawMysticalPattern(ctx);
    }

    // 绘制神秘图案
    drawMysticalPattern(ctx) {
        const centerX = 0;
        const centerY = 0;
        const radius = Math.min(this.width, this.height) / 2 - 10;

        ctx.save();

        // 外圆环
        ctx.strokeStyle = CONFIG.colors.cardBackPattern;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // 内圆环
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        // 绘制八角星
        this.drawOctagram(ctx, centerX, centerY, radius * 0.5);

        // 中心符号
        ctx.fillStyle = CONFIG.colors.accent;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // 绘制八角星
    drawOctagram(ctx, x, y, radius) {
        ctx.save();
        ctx.strokeStyle = CONFIG.colors.accent;
        ctx.lineWidth = 1;

        const spikes = 8;
        ctx.beginPath();

        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes - Math.PI / 8;
            const r = i % 2 === 0 ? radius : radius * 0.4;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    // 绘制牌面
    drawFace(ctx) {
        // 背景
        ctx.fillStyle = '#FFFFFF';
        canvasManager.drawRoundRect(
            ctx,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            this.cornerRadius
        );
        ctx.fill();

        // 边框
        ctx.strokeStyle = this.getSuitColor();
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制内容
        this.drawCardContent(ctx);
    }

    // 获取花色颜色
    getSuitColor() {
        if (this.data.suit === 'wands' || this.data.suit === 'swords') {
            return '#000000';
        } else if (this.data.suit === 'cups') {
            return '#1E90FF';
        } else if (this.data.suit === 'pentacles') {
            return '#228B22';
        }
        return CONFIG.colors.primary;
    }

    // 绘制卡牌内容
    drawCardContent(ctx) {
        const padding = 8;
        const contentWidth = this.width - padding * 2;
        const contentHeight = this.height - padding * 2;

        ctx.save();

        // 绘制角落数字
        this.drawCornerNumbers(ctx);

        // 绘制中心符号
        this.drawCenterSymbol(ctx);

        // 绘制卡牌名称
        this.drawCardName(ctx);

        ctx.restore();
    }

    // 绘制角落数字
    drawCornerNumbers(ctx) {
        const cornerSize = 12;
        const padding = 5;

        ctx.fillStyle = this.getSuitColor();
        ctx.font = `bold ${cornerSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 左上角
        ctx.fillText(this.data.number, -this.width / 2 + padding + cornerSize / 2, -this.height / 2 + padding + cornerSize / 2);

        // 右下角（旋转180度）
        ctx.save();
        ctx.rotate(Math.PI);
        ctx.fillText(this.data.number, -this.width / 2 + padding + cornerSize / 2, -this.height / 2 + padding + cornerSize / 2);
        ctx.restore();
    }

    // 绘制中心符号
    drawCenterSymbol(ctx) {
        const symbolSize = 30;
        const centerY = -5;

        ctx.fillStyle = this.getSuitColor();

        // 根据花色绘制符号
        switch(this.data.suit) {
            case 'wands':
                this.drawWandSymbol(ctx, 0, centerY, symbolSize);
                break;
            case 'cups':
                this.drawCupSymbol(ctx, 0, centerY, symbolSize);
                break;
            case 'swords':
                this.drawSwordSymbol(ctx, 0, centerY, symbolSize);
                break;
            case 'pentacles':
                this.drawPentacleSymbol(ctx, 0, centerY, symbolSize);
                break;
            case 'major':
                this.drawMajorSymbol(ctx, 0, centerY, symbolSize);
                break;
        }
    }

    // 绘制权杖符号
    drawWandSymbol(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);

        // 权杖主体
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-2, -size / 2, 4, size);

        // 叶子
        ctx.fillStyle = '#228B22';
        this.drawLeaf(ctx, -3, -size / 2 + 5, 5);
        this.drawLeaf(ctx, 3, -size / 2 + 12, 5);

        ctx.restore();
    }

    // 绘制叶子
    drawLeaf(ctx, x, y, size) {
        ctx.beginPath();
        ctx.ellipse(x, y, size / 2, size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制圣杯符号
    drawCupSymbol(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);

        // 杯身
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size / 3);
        ctx.lineTo(-size / 3, size / 3);
        ctx.lineTo(size / 3, size / 3);
        ctx.lineTo(size / 2, -size / 3);
        ctx.closePath();
        ctx.fill();

        // 杯底
        ctx.fillRect(-size / 6, size / 3, size / 3, size / 6);

        // 杯把手
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(size / 2, 0, size / 4, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        ctx.restore();
    }

    // 绘制宝剑符号
    drawSwordSymbol(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);

        // 剑刃
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(-size / 8, size / 6);
        ctx.lineTo(size / 8, size / 6);
        ctx.closePath();
        ctx.fill();

        // 剑柄
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-size / 12, size / 6, size / 6, size / 4);

        // 护手
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-size / 4, size / 6, size / 2, size / 12);

        ctx.restore();
    }

    // 绘制星币符号
    drawPentacleSymbol(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);

        // 外圆
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // 五角星
        this.drawPentagram(ctx, 0, 0, size / 2.5);

        ctx.restore();
    }

    // 绘制五角星
    drawPentagram(ctx, x, y, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 2);

        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }

    // 绘制大阿卡纳符号
    drawMajorSymbol(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);

        // 绘制罗马数字
        ctx.fillStyle = CONFIG.colors.primary;
        ctx.font = `bold ${size * 0.8}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.data.number, 0, 0);

        ctx.restore();
    }

    // 绘制卡牌名称
    drawCardName(ctx) {
        const y = this.height / 2 - 15;

        ctx.fillStyle = this.getSuitColor();
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 中文
        ctx.fillText(this.data.name, 0, y);
        // 英文
        ctx.font = '7px sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText(this.data.nameEn, 0, y + 10);
    }

    // 翻转卡牌
    flip() {
        this.isFlipping = true;
        this.flipProgress = 0;
        audioManager.play('flip');

        // 触发粒子效果
        if (canvasManager) {
            const particles = window.magicParticles;
            if (particles) {
                particles.createCardFlipEffect(
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            }
        }
    }

    // 移动到目标位置
    moveTo(x, y, duration = 300) {
        this.targetX = x;
        this.targetY = y;
    }

    // 旋转到目标角度
    rotateTo(angle) {
        this.targetRotation = angle;
    }

    // 设置缩放
    setScale(scale) {
        this.targetScale = scale;
    }

    // 选中/取消选中
    toggleSelected() {
        this.isSelected = !this.isSelected;
        audioManager.play('deal');
        return this.isSelected;
    }

    // 检测点是否在卡牌内
    containsPoint(px, py) {
        const halfWidth = this.width / 2 * this.scale;
        const halfHeight = this.height / 2 * this.scale;

        return px >= this.x - halfWidth &&
               px <= this.x + halfWidth &&
               py >= this.y - halfHeight &&
               py <= this.y + halfHeight;
    }

    // 设置悬停状态
    setHovered(hovered) {
        this.isHovered = hovered;
    }

    // 设置拖拽状态
    setDragging(dragging) {
        this.isDragging = dragging;
    }

    // 重置状态
    reset() {
        this.isFaceUp = false;
        this.isFlipping = false;
        this.flipProgress = 0;
        this.isHovered = false;
        this.isSelected = false;
        this.isDragging = false;
        this.scale = 1;
        this.targetScale = 1;
        this.rotation = 0;
        this.targetRotation = 0;
        this.glowIntensity = 0;
    }
}

// 导出到全局
window.TarotCard = TarotCard;
