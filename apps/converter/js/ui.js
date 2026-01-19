/**
 * UI交互控制器 - 管理DOM元素、事件绑定、界面更新
 */

import { currencies, defaults, errorMessages, successMessages } from './config.js';
import { formatHistoryTime } from './storage.js';

class UIController {
    constructor() {
        this.elements = {};
        this.debounceTimer = null;
        this.currentRates = null;
        this.currentBaseCurrency = defaults.fromCurrency;
    }

    /**
     * 初始化UI
     */
    init() {
        this.cacheElements();
        this.populateCurrencySelectors();
        this.bindEvents();
    }

    /**
     * 缓存DOM元素引用
     */
    cacheElements() {
        this.elements = {
            fromCurrency: document.getElementById('fromCurrency'),
            toCurrency: document.getElementById('toCurrency'),
            amount: document.getElementById('amount'),
            swapBtn: document.getElementById('swapBtn'),
            result: document.getElementById('result'),
            rateInfo: document.getElementById('rateInfo'),
            updateTime: document.getElementById('updateTime'),
            copyBtn: document.getElementById('copyBtn'),
            addFavoriteBtn: document.getElementById('addFavoriteBtn'),
            rateTable: document.getElementById('rateTable'),
            favorites: document.getElementById('favorites'),
            history: document.getElementById('history'),
            clearHistory: document.getElementById('clearHistory'),
            offlineNotice: document.getElementById('offlineNotice'),
            notification: document.getElementById('notification')
        };
    }

    /**
     * 填充货币选择器
     */
    populateCurrencySelectors() {
        const optionsHTML = currencies.map(currency => `
            <option value="${currency.code}">
                ${currency.flag} ${currency.code} - ${currency.name}
            </option>
        `).join('');

        this.elements.fromCurrency.innerHTML = optionsHTML;
        this.elements.toCurrency.innerHTML = optionsHTML;

        // 设置默认值
        this.elements.fromCurrency.value = defaults.fromCurrency;
        this.elements.toCurrency.value = defaults.toCurrency;
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 货币选择器变化
        this.elements.fromCurrency.addEventListener('change', () => {
            this.currentBaseCurrency = this.elements.fromCurrency.value;
            this.onCurrencyChange();
        });

        this.elements.toCurrency.addEventListener('change', () => {
            this.onCurrencyChange();
        });

        // 金额输入（防抖）
        this.elements.amount.addEventListener('input', () => {
            this.onAmountInput();
        });

        // 交换按钮
        this.elements.swapBtn.addEventListener('click', () => {
            this.onSwapCurrencies();
        });

        // 复制按钮
        this.elements.copyBtn.addEventListener('click', () => {
            this.onCopyResult();
        });

        // 收藏按钮
        this.elements.addFavoriteBtn.addEventListener('click', () => {
            this.onToggleFavorite();
        });

        // 清除历史按钮
        this.elements.clearHistory.addEventListener('click', () => {
            this.onClearHistory();
        });
    }

    /**
     * 货币选择器变化回调
     */
    onCurrencyChange() {
        if (this.onCurrencyChangeCallback) {
            this.onCurrencyChangeCallback();
        }
    }

    /**
     * 金额输入回调（防抖）
     */
    onAmountInput() {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            if (this.onAmountChangeCallback) {
                this.onAmountChangeCallback();
            }
        }, defaults.debounceDelay);
    }

    /**
     * 交换货币回调
     */
    onSwapCurrencies() {
        const temp = this.elements.fromCurrency.value;
        this.elements.fromCurrency.value = this.elements.toCurrency.value;
        this.elements.toCurrency.value = temp;

        this.currentBaseCurrency = this.elements.fromCurrency.value;

        // 添加旋转动画
        this.elements.swapBtn.classList.add('rotating');
        setTimeout(() => {
            this.elements.swapBtn.classList.remove('rotating');
        }, 300);

        if (this.onSwapCallback) {
            this.onSwapCallback();
        }
    }

    /**
     * 复制结果回调
     */
    onCopyResult() {
        const resultText = this.elements.result.textContent;

        if (resultText === '--' || resultText === '') {
            return;
        }

        navigator.clipboard.writeText(resultText)
            .then(() => {
                this.showNotification(successMessages.copySuccess, 'success');
            })
            .catch(() => {
                this.showNotification(errorMessages.copyError, 'error');
            });
    }

    /**
     * 切换收藏回调
     */
    onToggleFavorite() {
        if (this.onToggleFavoriteCallback) {
            this.onToggleFavoriteCallback();
        }
    }

    /**
     * 清除历史回调
     */
    onClearHistory() {
        if (this.onClearHistoryCallback) {
            this.onClearHistoryCallback();
        }
    }

    /**
     * 更新转换结果显示
     */
    updateResult(result, rate, updateTime, isOffline = false) {
        this.elements.result.textContent = result;
        this.elements.rateInfo.textContent = rate;
        this.elements.updateTime.textContent = updateTime;

        // 启用按钮
        this.elements.copyBtn.disabled = false;
        this.elements.addFavoriteBtn.disabled = false;

        // 显示/隐藏离线模式提示
        this.elements.offlineNotice.style.display = isOffline ? 'block' : 'none';
    }

    /**
     * 更新汇率速查表
     */
    updateRateTable(rates, baseCurrency) {
        this.currentRates = rates;

        const baseCurrencyInfo = currencies.find(c => c.code === baseCurrency);

        // 选择要显示的常见货币对
        const displayCurrencies = currencies.filter(c => c.code !== baseCurrency).slice(0, 8);

        const rateTableHTML = displayCurrencies.map(currency => {
            const rate = rates[currency.code];
            if (!rate) return '';

            return `
                <div class="rate-item">
                    <span class="rate-pair">${baseCurrencyInfo?.symbol || baseCurrency}/${currency.symbol || currency.code}</span>
                    <span class="rate-value">${rate.toFixed(4)}</span>
                </div>
            `;
        }).join('');

        this.elements.rateTable.innerHTML = rateTableHTML;
    }

    /**
     * 更新收藏列表
     */
    updateFavorites(favorites, onFavoriteClick, onFavoriteRemove) {
        if (favorites.length === 0) {
            this.elements.favorites.innerHTML = '<p class="empty-state">暂无收藏，点击"收藏"按钮添加常用货币对</p>';
            return;
        }

        const favoritesHTML = favorites.map(fav => {
            const fromCurrency = currencies.find(c => c.code === fav.from);
            const toCurrency = currencies.find(c => c.code === fav.to);

            return `
                <div class="favorite-item" data-from="${fav.from}" data-to="${fav.to}">
                    <span class="favorite-pair">
                        ${fromCurrency?.flag || ''} ${fav.from} → ${toCurrency?.flag || ''} ${fav.to}
                    </span>
                    <button class="favorite-remove" data-from="${fav.from}" data-to="${fav.to}">×</button>
                </div>
            `;
        }).join('');

        this.elements.favorites.innerHTML = favoritesHTML;

        // 绑定收藏项点击事件
        this.elements.favorites.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('favorite-remove')) {
                    return;
                }
                const from = item.dataset.from;
                const to = item.dataset.to;
                onFavoriteClick(from, to);
            });
        });

        // 绑定删除按钮事件
        this.elements.favorites.querySelectorAll('.favorite-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const from = btn.dataset.from;
                const to = btn.dataset.to;
                onFavoriteRemove(from, to);
            });
        });
    }

    /**
     * 更新历史记录列表
     */
    updateHistory(history, onHistoryClick) {
        if (history.length === 0) {
            this.elements.history.innerHTML = '<p class="empty-state">暂无转换记录</p>';
            return;
        }

        const historyHTML = history.map(item => {
            const timeStr = formatHistoryTime(item.timestamp);

            return `
                <div class="history-item" data-timestamp="${item.timestamp}">
                    <div class="history-details">
                        <div class="history-conversion">${item.conversion}</div>
                        <div class="history-time">${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.history.innerHTML = historyHTML;

        // 绑定历史项点击事件
        this.elements.history.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const timestamp = parseInt(item.dataset.timestamp);
                onHistoryClick(timestamp);
            });
        });
    }

    /**
     * 更新收藏按钮状态
     */
    updateFavoriteButton(isFavorite) {
        if (isFavorite) {
            this.elements.addFavoriteBtn.classList.add('active');
            this.elements.addFavoriteBtn.textContent = '★ 已收藏';
        } else {
            this.elements.addFavoriteBtn.classList.remove('active');
            this.elements.addFavoriteBtn.textContent = '⭐ 收藏';
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        this.elements.result.textContent = '计算中...';
        this.elements.rateInfo.textContent = '加载中...';
        this.elements.copyBtn.disabled = true;
        this.elements.addFavoriteBtn.disabled = true;
    }

    /**
     * 显示通知消息
     */
    showNotification(message, type = 'info') {
        const notification = this.elements.notification;

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    /**
     * 设置货币选择器值
     */
    setCurrencySelectors(from, to) {
        this.elements.fromCurrency.value = from;
        this.elements.toCurrency.value = to;
        this.currentBaseCurrency = from;
    }

    /**
     * 获取当前选择的货币
     */
    getSelectedCurrencies() {
        return {
            from: this.elements.fromCurrency.value,
            to: this.elements.toCurrency.value,
            amount: parseFloat(this.elements.amount.value) || 0
        };
    }

    /**
     * 设置金额
     */
    setAmount(amount) {
        this.elements.amount.value = amount;
    }

    /**
     * 注册回调函数
     */
    onCurrencyChange(fn) {
        this.onCurrencyChangeCallback = fn;
    }

    onAmountChange(fn) {
        this.onAmountChangeCallback = fn;
    }

    onSwap(fn) {
        this.onSwapCallback = fn;
    }

    onToggleFavorite(fn) {
        this.onToggleFavoriteCallback = fn;
    }

    onClearHistory(fn) {
        this.onClearHistoryCallback = fn;
    }
}

export default new UIController();
