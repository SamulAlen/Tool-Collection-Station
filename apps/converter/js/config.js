/**
 * 配置文件 - 货币列表、API端点、默认设置
 */

// 支持的货币列表
export const currencies = [
    { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
    { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
    { code: 'EUR', name: '欧元', symbol: '€', flag: '🇪🇺' },
    { code: 'JPY', name: '日元', symbol: '¥', flag: '🇯🇵' },
    { code: 'GBP', name: '英镑', symbol: '£', flag: '🇬🇧' },
    { code: 'KRW', name: '韩元', symbol: '₩', flag: '🇰🇷' },
    { code: 'HKD', name: '港币', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'AUD', name: '澳元', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: '加元', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: '瑞士法郎', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
    { code: 'INR', name: '印度卢比', symbol: '₹', flag: '🇮🇳' }
];

// API配置 - 使用免费汇率API
export const apiConfig = {
    // 免费汇率API，无需密钥，支持200+货币
    exchangeApiUrl: 'https://v2.xxapi.cn/api/exchange',
    timeout: 10000,
    cacheDuration: 60 * 60 * 1000 // 60分钟缓存（每小时更新）
};

// 默认设置
export const defaults = {
    fromCurrency: 'USD',
    toCurrency: 'CNY',
    amount: 100,
    maxHistoryItems: 20,
    debounceDelay: 300 // 输入防抖延迟（毫秒）
};

// 备用固定汇率（当API不可用时使用）
export const fallbackRates = {
    USD: 1,
    CNY: 7.24,
    EUR: 0.92,
    JPY: 149.50,
    GBP: 0.79,
    KRW: 1320.50,
    HKD: 7.83,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    SGD: 1.34,
    INR: 83.12
};

// 本地存储键名
export const storageKeys = {
    rates: 'currency_converter_rates',
    ratesTimestamp: 'currency_converter_rates_timestamp',
    history: 'currency_converter_history',
    favorites: 'currency_converter_favorites'
};

// 错误消息
export const errorMessages = {
    networkError: '网络连接失败，正在使用离线模式',
    invalidInput: '请输入有效的金额',
    conversionError: '转换失败，请稍后重试',
    copyError: '复制失败，请手动复制',
    sameCurrency: '请选择不同的货币进行转换'
};

// 成功消息
export const successMessages = {
    copySuccess: '已复制到剪贴板',
    favoriteAdded: '已添加到收藏',
    favoriteRemoved: '已从收藏中移除',
    historyCleared: '历史记录已清除'
};
