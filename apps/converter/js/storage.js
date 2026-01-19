/**
 * 本地存储管理模块 - 历史记录、收藏货币对
 */

import { storageKeys, defaults } from './config.js';

/**
 * 保存转换历史记录
 * @param {Object} record - 历史记录对象
 */
export function saveHistory(record) {
    try {
        const history = getHistory();

        // 添加新记录到开头
        history.unshift({
            ...record,
            timestamp: Date.now()
        });

        // 限制历史记录数量
        const limitedHistory = history.slice(0, defaults.maxHistoryItems);

        localStorage.setItem(storageKeys.history, JSON.stringify(limitedHistory));

    } catch (error) {
        console.error('保存历史记录失败:', error);
    }
}

/**
 * 获取转换历史记录
 * @returns {Array} 历史记录数组
 */
export function getHistory() {
    try {
        const historyData = localStorage.getItem(storageKeys.history);

        if (!historyData) {
            return [];
        }

        return JSON.parse(historyData);

    } catch (error) {
        console.error('获取历史记录失败:', error);
        return [];
    }
}

/**
 * 清除所有历史记录
 */
export function clearHistory() {
    try {
        localStorage.removeItem(storageKeys.history);
    } catch (error) {
        console.error('清除历史记录失败:', error);
    }
}

/**
 * 删除单条历史记录
 * @param {number} timestamp - 记录的时间戳
 */
export function removeHistoryItem(timestamp) {
    try {
        const history = getHistory();
        const filteredHistory = history.filter(item => item.timestamp !== timestamp);

        localStorage.setItem(storageKeys.history, JSON.stringify(filteredHistory));

    } catch (error) {
        console.error('删除历史记录失败:', error);
    }
}

/**
 * 保存收藏的货币对
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 */
export function saveFavorite(fromCurrency, toCurrency) {
    try {
        const favorites = getFavorites();

        // 检查是否已存在
        const exists = favorites.some(
            fav => fav.from === fromCurrency && fav.to === toCurrency
        );

        if (exists) {
            return false; // 已存在，不需要重复添加
        }

        // 添加新的收藏
        favorites.push({
            from: fromCurrency,
            to: toCurrency,
            timestamp: Date.now()
        });

        localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));

        return true; // 添加成功

    } catch (error) {
        console.error('保存收藏失败:', error);
        return false;
    }
}

/**
 * 获取收藏的货币对列表
 * @returns {Array} 收藏列表
 */
export function getFavorites() {
    try {
        const favoritesData = localStorage.getItem(storageKeys.favorites);

        if (!favoritesData) {
            return [];
        }

        return JSON.parse(favoritesData);

    } catch (error) {
        console.error('获取收藏失败:', error);
        return [];
    }
}

/**
 * 删除收藏的货币对
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @returns {boolean} 是否删除成功
 */
export function removeFavorite(fromCurrency, toCurrency) {
    try {
        const favorites = getFavorites();
        const filteredFavorites = favorites.filter(
            fav => !(fav.from === fromCurrency && fav.to === toCurrency)
        );

        localStorage.setItem(storageKeys.favorites, JSON.stringify(filteredFavorites));

        return true; // 删除成功

    } catch (error) {
        console.error('删除收藏失败:', error);
        return false;
    }
}

/**
 * 检查货币对是否已收藏
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @returns {boolean} 是否已收藏
 */
export function isFavorite(fromCurrency, toCurrency) {
    try {
        const favorites = getFavorites();

        return favorites.some(
            fav => fav.from === fromCurrency && fav.to === toCurrency
        );

    } catch (error) {
        console.error('检查收藏状态失败:', error);
        return false;
    }
}

/**
 * 切换收藏状态（添加/删除）
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @returns {boolean} 操作后的收藏状态（true=已收藏，false=未收藏）
 */
export function toggleFavorite(fromCurrency, toCurrency) {
    if (isFavorite(fromCurrency, toCurrency)) {
        removeFavorite(fromCurrency, toCurrency);
        return false;
    } else {
        saveFavorite(fromCurrency, toCurrency);
        return true;
    }
}

/**
 * 格式化历史记录时间
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export function formatHistoryTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }

    // 小于1小时
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
    }

    // 小于24小时
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
    }

    // 小于7天
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
    }

    // 超过7天，显示具体日期
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 清除所有存储数据（用于调试或重置）
 */
export function clearAllStorage() {
    try {
        Object.values(storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('清除所有存储失败:', error);
    }
}
