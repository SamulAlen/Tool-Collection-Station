/**
 * API调用模块 - 汇率数据获取、缓存管理、错误处理
 * 使用免费汇率API: https://v2.xxapi.cn/api/exchange
 * 无需API密钥，支持200+货币
 */

import { apiConfig, fallbackRates, storageKeys, currencies } from './config.js';

/**
 * 获取汇率数据（支持所有货币对）
 * @param {string} baseCurrency - 基础货币代码
 * @returns {Promise<Object>} 汇率数据对象
 */
export async function fetchRates(baseCurrency) {
    // 检查缓存是否有效
    const cachedRates = getCachedRates(baseCurrency);
    if (cachedRates && !isRatesExpired()) {
        console.log('使用缓存的汇率数据');
        return cachedRates;
    }

    console.log(`正在获取 ${baseCurrency} 的汇率数据...`);

    try {
        // 使用新的免费汇率API
        const rates = await fetchAllRates(baseCurrency);

        // 保存到缓存
        saveRatesToCache(baseCurrency, rates);

        console.log('汇率数据获取成功');
        return rates;

    } catch (error) {
        console.error('API请求失败，使用备用汇率:', error);
        // 返回备用汇率
        const fallbackRatesData = getFallbackRates(baseCurrency);
        console.log('使用备用汇率数据');
        return fallbackRatesData;
    }
}

/**
 * 获取所有货币的汇率（通过多次调用API）
 * @param {string} baseCurrency - 基础货币代码
 * @returns {Promise<Object>} 汇率数据对象
 */
async function fetchAllRates(baseCurrency) {
    const rates = {};
    const promises = [];
    let successCount = 0;
    let failCount = 0;

    // 为每个目标货币创建API请求
    for (const currency of currencies) {
        if (currency.code === baseCurrency) {
            rates[currency.code] = 1; // 自身汇率为1
            continue;
        }

        promises.push(
            fetchExchangeRate(baseCurrency, currency.code)
                .then(rate => {
                    rates[currency.code] = rate;
                    successCount++;
                    console.log(`✓ ${baseCurrency} → ${currency.code}: ${rate.toFixed(4)}`);
                })
                .catch(error => {
                    failCount++;
                    console.warn(`✗ 获取 ${baseCurrency} 到 ${currency.code} 汇率失败:`, error.message);
                    // 使用备用汇率
                    rates[currency.code] = getFallbackRate(baseCurrency, currency.code);
                })
        );
    }

    // 等待所有请求完成（无论成功或失败）
    await Promise.allSettled(promises);

    console.log(`汇率获取完成: ${successCount} 成功, ${failCount} 失败`);

    // 如果全部失败，抛出错误
    if (failCount > 0 && successCount === 0) {
        throw new Error('所有汇率请求都失败了');
    }

    return rates;
}

/**
 * 获取单个货币对的汇率
 * @param {string} from - 源货币代码
 * @param {string} to - 目标货币代码
 * @returns {Promise<number>} 汇率值
 */
async function fetchExchangeRate(from, to) {
    const url = `${apiConfig.exchangeApiUrl}?from=${from}&to=${to}&amount=1`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 检查API响应
    if (data.code !== 200) {
        throw new Error(`API error: ${data.msg || 'Unknown error'}`);
    }

    return data.data.rate;
}

/**
 * 带超时的fetch请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Response>} 响应对象
 */
function fetchWithTimeout(url, options = {}) {
    const { timeout = apiConfig.timeout } = options;

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);

        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
}

/**
 * 获取缓存的汇率数据
 * @param {string} baseCurrency - 基础货币代码
 * @returns {Object|null} 缓存的汇率数据或null
 */
function getCachedRates(baseCurrency) {
    try {
        const cacheKey = `${storageKeys.rates}_${baseCurrency}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return parsed.rates;
        }

        return null;
    } catch (error) {
        console.error('读取缓存失败:', error);
        return null;
    }
}

/**
 * 保存汇率数据到缓存
 * @param {string} baseCurrency - 基础货币代码
 * @param {Object} rates - 汇率数据
 * @param {string} date - 汇率日期（可选）
 */
function saveRatesToCache(baseCurrency, rates, date) {
    try {
        const cacheKey = `${storageKeys.rates}_${baseCurrency}`;
        const dataToCache = {
            rates,
            date: date || new Date().toISOString().split('T')[0],
            timestamp: Date.now()
        };

        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        localStorage.setItem(storageKeys.ratesTimestamp, Date.now().toString());

    } catch (error) {
        console.error('保存缓存失败:', error);
    }
}

/**
 * 检查缓存是否过期
 * @returns {boolean} 是否过期
 */
function isRatesExpired() {
    try {
        const timestamp = localStorage.getItem(storageKeys.ratesTimestamp);

        if (!timestamp) {
            return true;
        }

        const elapsed = Date.now() - parseInt(timestamp);
        return elapsed > apiConfig.cacheDuration;

    } catch (error) {
        console.error('检查缓存过期失败:', error);
        return true;
    }
}

/**
 * 获取备用汇率数据
 * @param {string} baseCurrency - 基础货币代码
 * @returns {Object} 备用汇率数据
 */
function getFallbackRates(baseCurrency) {
    const baseRate = fallbackRates[baseCurrency] || 1;

    const rates = {};
    for (const [currency, rate] of Object.entries(fallbackRates)) {
        rates[currency] = rate / baseRate;
    }

    return rates;
}

/**
 * 获取单个备用汇率
 * @param {string} from - 源货币代码
 * @param {string} to - 目标货币代码
 * @returns {number} 备用汇率值
 */
function getFallbackRate(from, to) {
    const fromRate = fallbackRates[from] || 1;
    const toRate = fallbackRates[to] || 1;

    return toRate / fromRate;
}

/**
 * 获取汇率更新时间
 * @returns {string|null} 更新时间字符串
 */
export function getRatesUpdateTime() {
    try {
        const timestamp = localStorage.getItem(storageKeys.ratesTimestamp);

        if (!timestamp) {
            return null;
        }

        const date = new Date(parseInt(timestamp));
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

    } catch (error) {
        console.error('获取更新时间失败:', error);
        return null;
    }
}

/**
 * 清除汇率缓存
 */
export function clearRatesCache() {
    try {
        // 清除所有货币的缓存
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(storageKeys.rates)) {
                localStorage.removeItem(key);
            }
        });

        localStorage.removeItem(storageKeys.ratesTimestamp);

    } catch (error) {
        console.error('清除缓存失败:', error);
    }
}
