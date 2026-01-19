/**
 * 转换逻辑核心模块 - 货币转换计算、结果格式化
 */

import { currencies } from './config.js';

/**
 * 执行货币转换
 * @param {number} amount - 转换金额
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @param {Object} rates - 汇率数据
 * @returns {number} 转换结果
 */
export function convert(amount, fromCurrency, toCurrency, rates) {
    if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
        throw new Error('无效的汇率数据');
    }

    // 获取基于USD的汇率
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    // 计算转换结果
    const result = (amount / fromRate) * toRate;

    return result;
}

/**
 * 格式化转换结果
 * @param {number} value - 转换结果数值
 * @param {string} currencyCode - 货币代码
 * @returns {string} 格式化后的结果字符串
 */
export function formatResult(value, currencyCode) {
    const currency = currencies.find(c => c.code === currencyCode);

    if (!currency) {
        return formatNumber(value);
    }

    // 根据货币类型确定小数位数
    let decimals = 2;
    if (currencyCode === 'JPY' || currencyCode === 'KRW') {
        decimals = 0; // 日元和韩元通常不显示小数
    }

    const formattedNumber = formatNumber(value, decimals);
    return `${currency.symbol} ${formattedNumber}`;
}

/**
 * 格式化数字（添加千位分隔符）
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的数字字符串
 */
function formatNumber(num, decimals = 2) {
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * 格式化汇率信息
 * @param {number} rate - 汇率值
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @returns {string} 格式化后的汇率字符串
 */
export function formatRate(rate, fromCurrency, toCurrency) {
    const fromCurrencyInfo = currencies.find(c => c.code === fromCurrency);
    const toCurrencyInfo = currencies.find(c => c.code === toCurrency);

    if (!fromCurrencyInfo || !toCurrencyInfo) {
        return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    }

    // 计算反向汇率
    const reverseRate = 1 / rate;

    return `1 ${fromCurrencyInfo.symbol} = ${rate.toFixed(4)} ${toCurrencyInfo.symbol}`;
}

/**
 * 验证输入金额
 * @param {string|number} amount - 输入金额
 * @returns {boolean} 是否有效
 */
export function isValidAmount(amount) {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num) || num < 0) {
        return false;
    }

    // 检查是否为过大数字
    if (num > 1e15) {
        return false;
    }

    return true;
}

/**
 * 计算两个货币之间的汇率
 * @param {string} fromCurrency - 源货币代码
 * @param {string} toCurrency - 目标货币代码
 * @param {Object} rates - 汇率数据
 * @returns {number} 汇率值
 */
export function getExchangeRate(fromCurrency, toCurrency, rates) {
    if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
        throw new Error('无效的汇率数据');
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    return toRate / fromRate;
}

/**
 * 批量转换（一个金额转换为多种货币）
 * @param {number} amount - 转换金额
 * @param {string} fromCurrency - 源货币代码
 * @param {Array<string>} toCurrencies - 目标货币代码数组
 * @param {Object} rates - 汇率数据
 * @returns {Object} 转换结果对象
 */
export function convertMultiple(amount, fromCurrency, toCurrencies, rates) {
    const results = {};

    for (const toCurrency of toCurrencies) {
        try {
            results[toCurrency] = convert(amount, fromCurrency, toCurrency, rates);
        } catch (error) {
            console.error(`转换 ${fromCurrency} 到 ${toCurrency} 失败:`, error);
            results[toCurrency] = null;
        }
    }

    return results;
}

/**
 * 计算汇率变化（用于显示涨跌）
 * @param {number} currentRate - 当前汇率
 * @param {number} previousRate - 之前的汇率
 * @returns {Object} 变化信息
 */
export function calculateRateChange(currentRate, previousRate) {
    const change = currentRate - previousRate;
    const percentChange = (change / previousRate) * 100;

    return {
        change,
        percentChange,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
}
