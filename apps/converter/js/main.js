/**
 * 应用入口 - 协调各模块，初始化应用
 */

import { defaults, errorMessages, successMessages, currencies } from './config.js';
import { fetchRates, getRatesUpdateTime } from './api.js';
import { convert, formatResult, getExchangeRate, isValidAmount } from './converter.js';
import UI from './ui.js';
import {
    saveHistory,
    getHistory,
    clearHistory,
    saveFavorite,
    getFavorites,
    removeFavorite,
    isFavorite,
    toggleFavorite
} from './storage.js';

/**
 * 应用状态
 */
const appState = {
    rates: null,
    currentFromCurrency: defaults.fromCurrency,
    currentToCurrency: defaults.toCurrency,
    currentAmount: defaults.amount,
    isOffline: false
};

/**
 * 初始化应用
 */
async function init() {
    UI.init();

    // 注册UI回调
    registerCallbacks();

    // 加载初始数据
    await loadInitialData();

    // 更新收藏列表
    updateFavoritesList();
}

/**
 * 注册UI回调函数
 */
function registerCallbacks() {
    // 货币选择变化
    UI.onCurrencyChange(async () => {
        const { from, to, amount } = UI.getSelectedCurrencies();
        appState.currentFromCurrency = from;
        appState.currentToCurrency = to;
        appState.currentAmount = amount;

        await updateConversion();
        updateFavoriteButton();
    });

    // 金额变化
    UI.onAmountChange(async () => {
        const { from, to, amount } = UI.getSelectedCurrencies();
        appState.currentFromCurrency = from;
        appState.currentToCurrency = to;
        appState.currentAmount = amount;

        await updateConversion();
    });

    // 交换货币
    UI.onSwap(async () => {
        const { from, to } = UI.getSelectedCurrencies();
        appState.currentFromCurrency = from;
        appState.currentToCurrency = to;

        await updateConversion();
        updateFavoriteButton();
    });

    // 切换收藏
    UI.onToggleFavorite(() => {
        const { from, to } = UI.getSelectedCurrencies();
        toggleFavorite(from, to);
        updateFavoriteButton();
        updateFavoritesList();

        const isFav = isFavorite(from, to);
        UI.showNotification(
            isFav ? successMessages.favoriteAdded : successMessages.favoriteRemoved,
            'success'
        );
    });

    // 清除历史
    UI.onClearHistory(() => {
        clearHistory();
        updateHistoryList();
        UI.showNotification(successMessages.historyCleared, 'success');
    });
}

/**
 * 加载初始数据
 */
async function loadInitialData() {
    try {
        console.log('开始加载初始数据...');

        // 获取汇率数据
        appState.rates = await fetchRates(defaults.fromCurrency);
        appState.currentFromCurrency = defaults.fromCurrency;

        console.log('汇率数据已加载:', appState.rates);

        // 更新汇率速查表
        UI.updateRateTable(appState.rates, defaults.fromCurrency);

        // 执行初始转换
        await performConversion();

        // 更新历史记录
        updateHistoryList();

        console.log('初始数据加载完成');

    } catch (error) {
        console.error('加载初始数据失败:', error);
        UI.showNotification(errorMessages.networkError, 'error');
        appState.isOffline = true;

        // 即使失败也使用备用数据
        if (!appState.rates) {
            console.log('尝试使用备用汇率...');
            appState.rates = await getFallbackRatesSync(defaults.fromCurrency);
            await performConversion();
        }
    }
}

/**
 * 同步获取备用汇率（用于错误恢复）
 */
async function getFallbackRatesSync(baseCurrency) {
    // 动态导入fallbackRates
    const { fallbackRates } = await import('./config.js');
    const baseRate = fallbackRates[baseCurrency] || 1;

    const rates = {};
    for (const currency of currencies) {
        rates[currency.code] = (fallbackRates[currency.code] || 1) / baseRate;
    }

    return rates;
}

/**
 * 更新转换
 */
async function updateConversion() {
    const { from, to } = UI.getSelectedCurrencies();

    // 如果基础货币变化，需要重新获取汇率
    if (from !== appState.currentFromCurrency || !appState.rates) {
        try {
            appState.rates = await fetchRates(from);
            UI.updateRateTable(appState.rates, from);
            appState.isOffline = false;
        } catch (error) {
            console.error('获取汇率失败:', error);
            appState.isOffline = true;
        }
    }

    await performConversion();
}

/**
 * 执行转换
 */
async function performConversion() {
    const { from, to, amount } = UI.getSelectedCurrencies();

    // 验证输入
    if (!isValidAmount(amount)) {
        UI.updateResult('--', '--', '');
        return;
    }

    // 检查是否选择相同货币
    if (from === to) {
        UI.showNotification(errorMessages.sameCurrency, 'error');
        return;
    }

    try {
        // 执行转换
        const result = convert(amount, from, to, appState.rates);
        const formattedResult = formatResult(result, to);

        // 获取汇率
        const rate = getExchangeRate(from, to, appState.rates);
        const fromCurrency = currencies.find(c => c.code === from);
        const toCurrency = currencies.find(c => c.code === to);
        const rateInfo = `1 ${fromCurrency?.symbol || from} = ${rate.toFixed(4)} ${toCurrency?.symbol || to}`;

        // 获取更新时间
        const updateTime = getRatesUpdateTime() || '';

        // 更新UI
        UI.updateResult(formattedResult, rateInfo, updateTime, appState.isOffline);

        // 保存到历史记录（仅在有效转换时）
        if (amount > 0 && result > 0) {
            saveHistoryRecord(amount, from, to, formattedResult);
        }

    } catch (error) {
        console.error('转换失败:', error);
        UI.showNotification(errorMessages.conversionError, 'error');
    }
}

/**
 * 保存历史记录
 */
function saveHistoryRecord(amount, from, to, result) {
    const fromCurrency = currencies.find(c => c.code === from);
    const toCurrency = currencies.find(c => c.code === to);

    const conversion = `${amount} ${from} → ${result} ${to}`;

    saveHistory({
        conversion,
        from,
        to,
        amount,
        result
    });

    // 更新历史记录列表
    updateHistoryList();
}

/**
 * 更新历史记录列表
 */
function updateHistoryList() {
    const history = getHistory();

    UI.updateHistory(history, (timestamp) => {
        // 点击历史记录项，恢复该次转换
        const record = history.find(h => h.timestamp === timestamp);
        if (record) {
            applyHistoryRecord(record);
        }
    });
}

/**
 * 应用历史记录
 */
function applyHistoryRecord(record) {
    UI.setCurrencySelectors(record.from, record.to);
    UI.setAmount(record.amount);

    appState.currentFromCurrency = record.from;
    appState.currentToCurrency = record.to;
    appState.currentAmount = record.amount;

    performConversion();
    updateFavoriteButton();
}

/**
 * 更新收藏按钮状态
 */
function updateFavoriteButton() {
    const { from, to } = UI.getSelectedCurrencies();
    const isFav = isFavorite(from, to);
    UI.updateFavoriteButton(isFav);
}

/**
 * 更新收藏列表
 */
function updateFavoritesList() {
    const favorites = getFavorites();

    UI.updateFavorites(
        favorites,
        // 点击收藏项
        (from, to) => {
            UI.setCurrencySelectors(from, to);
            appState.currentFromCurrency = from;
            appState.currentToCurrency = to;

            performConversion();
            updateFavoriteButton();
        },
        // 删除收藏
        (from, to) => {
            removeFavorite(from, to);
            updateFavoritesList();

            // 如果删除的是当前选中的货币对，更新收藏按钮
            const current = UI.getSelectedCurrencies();
            if (current.from === from && current.to === to) {
                updateFavoriteButton();
            }

            UI.showNotification(successMessages.favoriteRemoved, 'success');
        }
    );
}

// 初始化应用
init();
