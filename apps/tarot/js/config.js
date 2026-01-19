// 塔罗占卜配置文件

const CONFIG = {
    // 色彩配置
    colors: {
        primary: '#9D4EDD',
        secondary: '#7B2CBF',
        accent: '#C77DFF',
        gold: '#FFD700',
        silver: '#C0C0C0',
        mystical: '#5A189A',
        cardBack: '#1A0A2E',
        cardBackPattern: '#3C1E5E'
    },

    // 动画配置
    animation: {
        shuffleSpeed: 0.8,
        cardFlipSpeed: 0.4,
        dealSpeed: 0.5,
        glowIntensity: 0.6,
        particleSpeed: 1.0
    },

    // 粒子配置
    particles: {
        magic: {
            count: 50,
            size: { min: 2, max: 6 },
            colors: ['#9D4EDD', '#C77DFF', '#FFD700', '#E0AAFF'],
            lifetime: { min: 2000, max: 4000 },
            speed: { min: 0.5, max: 2.0 }
        },
        stars: {
            count: 100,
            size: { min: 1, max: 3 },
            colors: ['#FFFFFF', '#C0C0C0', '#E0AAFF'],
            twinkle: true
        }
    },

    // 卡牌配置
    card: {
        width: 80,
        height: 130,
        cornerRadius: 6,
        borderWidth: 2,
        glowColor: 'rgba(157, 78, 221, 0.5)',
        hoverScale: 1.1,
        selectedScale: 1.15
    },

    // 牌阵配置
    spreads: {
        single: {
            name: '单牌占卜',
            nameEn: 'Single Card',
            description: '适合快速获得指导',
            cardCount: 1,
            positions: [
                { name: '现状', x: 0.5, y: 0.5 }
            ]
        },
        three: {
            name: '三牌阵',
            nameEn: 'Three Card',
            description: '过去·现在·未来',
            cardCount: 3,
            positions: [
                { name: '过去', x: 0.25, y: 0.5 },
                { name: '现在', x: 0.5, y: 0.5 },
                { name: '未来', x: 0.75, y: 0.5 }
            ]
        },
        celtic: {
            name: '凯尔特十字',
            nameEn: 'Celtic Cross',
            description: '全面深入的分析',
            cardCount: 10,
            positions: [
                { name: '现状', x: 0.5, y: 0.5 },
                { name: '挑战', x: 0.5, y: 0.5, rotate: 90 },
                { name: '目标', x: 0.5, y: 0.35 },
                { name: '基础', x: 0.5, y: 0.65 },
                { name: '过去', x: 0.35, y: 0.5 },
                { name: '未来', x: 0.65, y: 0.5 },
                { name: '自己', x: 0.35, y: 0.35 },
                { name: '环境', x: 0.65, y: 0.35 },
                { name: '希望', x: 0.35, y: 0.65 },
                { name: '结果', x: 0.65, y: 0.65 }
            ]
        },
        horseshoe: {
            name: '马蹄形',
            nameEn: 'Horseshoe',
            description: '多角度分析问题',
            cardCount: 7,
            positions: [
                { name: '过去', x: 0.2, y: 0.5 },
                { name: '现在', x: 0.3, y: 0.4 },
                { name: '未来', x: 0.4, y: 0.35 },
                { name: '自己', x: 0.5, y: 0.35 },
                { name: '他人', x: 0.6, y: 0.4 },
                { name: '行动', x: 0.7, y: 0.5 },
                { name: '结果', x: 0.5, y: 0.6 }
            ]
        },
        star: {
            name: '星形牌阵',
            nameEn: 'Star Spread',
            description: '探索愿望的实现',
            cardCount: 7,
            positions: [
                { name: '现状', x: 0.5, y: 0.5 },
                { name: '障碍', x: 0.5, y: 0.35 },
                { name: '助力', x: 0.65, y: 0.425 },
                { name: '行动', x: 0.6, y: 0.6 },
                { name: '态度', x: 0.4, y: 0.6 },
                { name: '环境', x: 0.35, y: 0.425 },
                { name: '结果', x: 0.5, y: 0.75 }
            ]
        },
        relationship: {
            name: '关系牌阵',
            nameEn: 'Relationship',
            description: '分析情感关系',
            cardCount: 5,
            positions: [
                { name: '你', x: 0.35, y: 0.4 },
                { name: '对方', x: 0.65, y: 0.4 },
                { name: '关系', x: 0.5, y: 0.5 },
                { name: '挑战', x: 0.5, y: 0.65 },
                { name: '建议', x: 0.5, y: 0.8 }
            ]
        },
        daily: {
            name: '每日指引',
            nameEn: 'Daily Guidance',
            description: '今日的能量与建议',
            cardCount: 4,
            positions: [
                { name: '主题', x: 0.3, y: 0.5 },
                { name: '挑战', x: 0.45, y: 0.5 },
                { name: '机会', x: 0.6, y: 0.5 },
                { name: '建议', x: 0.75, y: 0.5 }
            ]
        },
        choice: {
            name: '选择牌阵',
            nameEn: 'Choice',
            description: '帮助做出选择',
            cardCount: 5,
            positions: [
                { name: '现状', x: 0.5, y: 0.4 },
                { name: '选项A', x: 0.3, y: 0.6 },
                { name: '选项A结果', x: 0.3, y: 0.75 },
                { name: '选项B', x: 0.7, y: 0.6 },
                { name: '选项B结果', x: 0.7, y: 0.75 }
            ]
        }
    },

    // 音效配置
    sounds: {
        enabled: true,
        volume: 0.3,
        shuffle: 'assets/sounds/shuffle.mp3',
        flip: 'assets/sounds/flip.mp3',
        deal: 'assets/sounds/deal.mp3',
        magic: 'assets/sounds/magic.mp3'
    },

    // 响应式断点
    breakpoints: {
        mobile: 768,
        tablet: 1024
    }
};

// 导出到全局
window.CONFIG = CONFIG;
