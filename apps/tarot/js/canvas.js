// 三层Canvas渲染架构
class CanvasManager {
    constructor() {
        // 获取三个canvas元素
        this.bgCanvas = document.getElementById('bg-canvas');
        this.tarotCanvas = document.getElementById('tarot-canvas');
        this.overlayCanvas = document.getElementById('overlay-canvas');

        // 获取对应的context
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.tarotCtx = this.tarotCanvas.getContext('2d');
        this.overlayCtx = this.overlayCanvas.getContext('2d');

        // 宽度和高度
        this.width = 0;
        this.height = 0;

        // 初始化
        this.init();
    }

    // 初始化
    init() {
        this.resize();
        window.addEventListener('resize', debounce(() => this.resize(), 150));
    }

    // 调整大小
    resize() {
        const pixelRatio = getPixelRatio();
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.width = width;
        this.height = height;

        // 设置所有canvas的大小
        [this.bgCanvas, this.tarotCanvas, this.overlayCanvas].forEach(canvas => {
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            const ctx = canvas.getContext('2d');
            ctx.scale(pixelRatio, pixelRatio);
        });

        // 触发重置事件
        window.dispatchEvent(new CustomEvent('canvasResize', {
            detail: { width, height }
        }));
    }

    // 清除指定层
    clearLayer(layer) {
        const ctx = this.getLayerContext(layer);
        if (ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    // 清除所有层
    clearAll() {
        this.clearLayer('background');
        this.clearLayer('tarot');
        this.clearLayer('overlay');
    }

    // 获取层context
    getLayerContext(layer) {
        switch(layer) {
            case 'background':
                return this.bgCtx;
            case 'tarot':
                return this.tarotCtx;
            case 'overlay':
                return this.overlayCtx;
            default:
                return null;
        }
    }

    // 获取层canvas
    getLayerCanvas(layer) {
        switch(layer) {
            case 'background':
                return this.bgCanvas;
            case 'tarot':
                return this.tarotCanvas;
            case 'overlay':
                return this.overlayCanvas;
            default:
                return null;
        }
    }

    // 绘制到指定层
    drawToLayer(layer, drawCallback) {
        const ctx = this.getLayerContext(layer);
        if (ctx && typeof drawCallback === 'function') {
            ctx.save();
            drawCallback(ctx);
            ctx.restore();
        }
    }

    // 创建渐变
    createGradient(layer, x1, y1, x2, y2, stops) {
        const ctx = this.getLayerContext(layer);
        if (!ctx) return null;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        stops.forEach(stop => {
            gradient.addColorStop(stop.position, stop.color);
        });
        return gradient;
    }

    // 创建径向渐变
    createRadialGradient(layer, x1, y1, r1, x2, y2, r2, stops) {
        const ctx = this.getLayerContext(layer);
        if (!ctx) return null;

        const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
        stops.forEach(stop => {
            gradient.addColorStop(stop.position, stop.color);
        });
        return gradient;
    }

    // 添加发光效果
    addGlow(layer, color, blur = 10) {
        const ctx = this.getLayerContext(layer);
        if (ctx) {
            ctx.shadowColor = color;
            ctx.shadowBlur = blur;
        }
    }

    // 移除发光效果
    removeGlow(layer) {
        const ctx = this.getLayerContext(layer);
        if (ctx) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }

    // 获取鼠标/触摸位置
    getPointerPosition(event) {
        const rect = this.tarotCanvas.getBoundingClientRect();
        let clientX, clientY;

        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    // 检测点是否在矩形内
    isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    }

    // 检测点是否在圆形内
    isPointInCircle(x, y, circle) {
        const dx = x - circle.x;
        const dy = y - circle.y;
        return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
    }

    // 绘制圆角矩形
    drawRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // 绘制发光边框
    drawGlowingBorder(ctx, x, y, width, height, radius, color, blur = 15) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        this.drawRoundRect(ctx, x, y, width, height, radius);
        ctx.stroke();
        ctx.restore();
    }

    // 创建快照
    createSnapshot(layer) {
        const canvas = this.getLayerCanvas(layer);
        if (canvas) {
            return canvas.toDataURL();
        }
        return null;
    }

    // 下载canvas内容
    downloadLayer(layer, filename = 'tarot-reading.png') {
        const canvas = this.getLayerCanvas(layer);
        if (canvas) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }
}

// 导出到全局
window.CanvasManager = CanvasManager;
