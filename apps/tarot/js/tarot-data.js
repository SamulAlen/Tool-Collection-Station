// 塔罗牌数据 - 完整78张牌
const TAROT_DATA = {
    // 大阿卡纳 (22张)
    majorArcana: [
        {
            id: 0,
            name: '愚者',
            nameEn: 'The Fool',
            number: '0',
            suit: 'major',
            meaning: {
                upright: '新的开始、冒险、纯真、自发性、自由精神',
                reversed: '鲁莽、冒险、被愚弄、疏忽、风险'
            },
            symbols: ['悬崖', '背包', '小狗', '白色玫瑰', '太阳'],
            element: '气',
            numerology: '0'
        },
        {
            id: 1,
            name: '魔术师',
            nameEn: 'The Magician',
            number: 'I',
            suit: 'major',
            meaning: {
                upright: '意志力、技能、集中、创造力、自信',
                reversed: '操控、欺骗、意志薄弱、缺乏技能'
            },
            symbols: ['权杖', '圣杯', '宝剑', '星币', '无限符号', '蛇'],
            element: '水星',
            numerology: '1'
        },
        {
            id: 2,
            name: '女祭司',
            nameEn: 'The High Priestess',
            number: 'II',
            suit: 'major',
            meaning: {
                upright: '直觉、潜意识、神秘、内在声音',
                reversed: '秘密、不稳定、压抑直觉、表面化'
            },
            symbols: ['卷轴', '石榴', '月亮', '帷幕', '两根柱子'],
            element: '月亮',
            numerology: '2'
        },
        {
            id: 3,
            name: '皇后',
            nameEn: 'The Empress',
            number: 'III',
            suit: 'major',
            meaning: {
                upright: '丰盛、母性、创造力、感官享受',
                reversed: '依赖、窒息、空虚、创造力受阻'
            },
            symbols: ['麦穗', '心形盾牌', '皇冠', '星星', '水流'],
            element: '金星',
            numerology: '3'
        },
        {
            id: 4,
            name: '皇帝',
            nameEn: 'The Emperor',
            number: 'IV',
            suit: 'major',
            meaning: {
                upright: '权威、结构、领导、父亲形象',
                reversed: '专制、缺乏纪律、控制欲、不成熟'
            },
            symbols: ['权杖', '皇冠', '盔甲', '石头', '鹰'],
            element: '白羊座',
            numerology: '4'
        },
        {
            id: 5,
            name: '教皇',
            nameEn: 'The Hierophant',
            number: 'V',
            suit: 'major',
            meaning: {
                upright: '传统、从众、 morality、道德指导',
                reversed: '反叛、非传统、新方法、自由思想'
            },
            symbols: ['三重十字架', '两把钥匙', '皇冠', '信徒'],
            element: '金牛座',
            numerology: '5'
        },
        {
            id: 6,
            name: '恋人',
            nameEn: 'The Lovers',
            number: 'VI',
            suit: 'major',
            meaning: {
                upright: '爱、和谐、关系、选择、价值观',
                reversed: '不和谐、失衡、错误的选择、分离'
            },
            symbols: ['亚当和夏娃', '天使', '生命树', '蛇', '山'],
            element: '双子座',
            numerology: '6'
        },
        {
            id: 7,
            name: '战车',
            nameEn: 'The Chariot',
            number: 'VII',
            suit: 'major',
            meaning: {
                upright: '控制、意志力、胜利、决心、专注',
                reversed: '失控、缺乏方向、攻击性、失败'
            },
            symbols: ['战车', '斯芬克斯', '星星华盖', '权杖'],
            element: '巨蟹座',
            numerology: '7'
        },
        {
            id: 8,
            name: '力量',
            nameEn: 'Strength',
            number: 'VIII',
            suit: 'major',
            meaning: {
                upright: '勇气、耐心、控制、同情心、内在力量',
                reversed: '自我怀疑、软弱、不安全感、缺乏自制'
            },
            symbols: ['狮子', '女人', '无限符号', '花卉', '白色长袍'],
            element: '狮子座',
            numerology: '8'
        },
        {
            id: 9,
            name: '隐士',
            nameEn: 'The Hermit',
            number: 'IX',
            suit: 'major',
            meaning: {
                upright: '内省、孤独、寻求真理、内在指导',
                reversed: '孤独、迷失、退缩、缺乏方向'
            },
            symbols: ['灯笼', '手杖', '山', '长袍', '星星'],
            element: '处女座',
            numerology: '9'
        },
        {
            id: 10,
            name: '命运之轮',
            nameEn: 'Wheel of Fortune',
            number: 'X',
            suit: 'major',
            meaning: {
                upright: '变化、周期、命运、转折点、好运',
                reversed: '坏运、抵抗变化、失控、恶性循环'
            },
            symbols: ['轮子', '斯芬克斯', '蛇', '女神', '生物'],
            element: '木星',
            numerology: '10'
        },
        {
            id: 11,
            name: '正义',
            nameEn: 'Justice',
            number: 'XI',
            suit: 'major',
            meaning: {
                upright: '公正、真理、因果、法律、公平',
                reversed: '不公、不诚实、缺乏责任感、逃避'
            },
            symbols: ['天平', '宝剑', '帷幕', '柱子', '皇冠'],
            element: '天秤座',
            numerology: '11'
        },
        {
            id: 12,
            name: '倒吊人',
            nameEn: 'The Hanged Man',
            number: 'XII',
            suit: 'major',
            meaning: {
                upright: '牺牲、放手、新视角、等待、悬置',
                reversed: '停滞、无谓牺牲、拖延、抵抗'
            },
            symbols: ['倒吊的人', '树', '光环', '平静表情'],
            element: '水',
            numerology: '12'
        },
        {
            id: 13,
            name: '死神',
            nameEn: 'Death',
            number: 'XIII',
            suit: 'major',
            meaning: {
                upright: '结束、转变、过渡、放下、重生',
                reversed: '抵抗变化、停滞、无法放手'
            },
            symbols: ['骷髅', '黑马', '旗帜', '太阳', '玫瑰'],
            element: '天蝎座',
            numerology: '13'
        },
        {
            id: 14,
            name: '节制',
            nameEn: 'Temperance',
            number: 'XIV',
            suit: 'major',
            meaning: {
                upright: '平衡、适度、耐心、目的性',
                reversed: '失衡、过度、缺乏长期视野'
            },
            symbols: ['天使', '两个杯子', '水', '彩虹', '脚'],
            element: '射手座',
            numerology: '14'
        },
        {
            id: 15,
            name: '恶魔',
            nameEn: 'The Devil',
            number: 'XV',
            suit: 'major',
            meaning: {
                upright: '束缚、成瘾、物质主义、阴暗面',
                reversed: '打破束缚、重获力量、独立'
            },
            symbols: ['恶魔', '被锁的人', '火炬', '钥匙'],
            element: '摩羯座',
            numerology: '15'
        },
        {
            id: 16,
            name: '高塔',
            nameEn: 'The Tower',
            number: 'XVI',
            suit: 'major',
            meaning: {
                upright: '突然变化、破坏、混乱、启示',
                reversed: '避免灾难、恐惧改变、延迟的痛苦'
            },
            symbols: ['塔', '闪电', '坠落的人', '火焰', '山'],
            element: '火星',
            numerology: '16'
        },
        {
            id: 17,
            name: '星星',
            nameEn: 'The Star',
            number: 'XVII',
            suit: 'major',
            meaning: {
                upright: '希望、灵感、宁静、精神力量',
                reversed: '绝望、缺乏信心、消极'
            },
            symbols: ['星星', '女人', '水', '树木', '鸟类'],
            element: '水瓶座',
            numerology: '17'
        },
        {
            id: 18,
            name: '月亮',
            nameEn: 'The Moon',
            number: 'XVIII',
            suit: 'major',
            meaning: {
                upright: '幻觉、恐惧、潜意识、直觉、不确定性',
                reversed: '释放恐惧、克服困惑、揭示真相'
            },
            symbols: ['月亮', '狗和狼', '龙虾', '塔', '水'],
            element: '双鱼座',
            numerology: '18'
        },
        {
            id: 19,
            name: '太阳',
            nameEn: 'The Sun',
            number: 'XIX',
            suit: 'major',
            meaning: {
                upright: '积极、温暖、成功、活力、快乐',
                reversed: '暂时的消沉、缺乏成功、悲观'
            },
            symbols: ['太阳', '孩子', '马', '向日葵', '墙'],
            element: '太阳',
            numerology: '19'
        },
        {
            id: 20,
            name: '审判',
            nameEn: 'Judgement',
            number: 'XX',
            suit: 'major',
            meaning: {
                upright: '审判、重生、内心召唤、宽恕',
                reversed: '自我怀疑、逃避召唤、忽视教训'
            },
            symbols: ['天使', '人', '旗帜', '棺材', '云'],
            element: '火',
            numerology: '20'
        },
        {
            id: 21,
            name: '世界',
            nameEn: 'The World',
            number: 'XXI',
            suit: 'major',
            meaning: {
                upright: '完成、整合、成就、旅行、圆满',
                reversed: '未完成、缺乏封闭、停滞、空虚'
            },
            symbols: ['女人', '花环', '狮子', '牛', '鹰', '天使'],
            element: '土星',
            numerology: '21'
        }
    ],

    // 小阿卡纳 - 权杖 (14张)
    wands: [
        {
            id: 22,
            name: '权杖首牌',
            nameEn: 'Ace of Wands',
            number: 'A',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '新的开始、灵感、火花、创造力',
                reversed: '延迟、缺乏动力、拖延'
            },
            element: '火',
            symbols: ['从手中长出的权杖', '叶子', '云']
        },
        {
            id: 23,
            name: '权杖二',
            nameEn: 'Two of Wands',
            number: '2',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '未来规划、进步、决策、发现',
                reversed: '恐惧未知、缺乏计划、拖延'
            },
            element: '火',
            symbols: ['权杖', '地球仪', '城墙']
        },
        {
            id: 24,
            name: '权杖三',
            nameEn: 'Three of Wands',
            number: '3',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '进步、扩张、远见、机会',
                reversed: '障碍、挫折、缺乏远见'
            },
            element: '火',
            symbols: ['三根权杖', '船只', '地平线']
        },
        {
            id: 25,
            name: '权杖四',
            nameEn: 'Four of Wands',
            number: '4',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '庆祝、和谐、婚姻、家园',
                reversed: '缺乏和谐、过渡期、不稳定性'
            },
            element: '火',
            symbols: ['四根权杖', '花环', '城堡', '人物']
        },
        {
            id: 26,
            name: '权杖五',
            nameEn: 'Five of Wands',
            number: '5',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '冲突、竞争、斗争、张力',
                reversed: '避免冲突、竞争压力、和解'
            },
            element: '火',
            symbols: ['五根权杖', '争斗的人']
        },
        {
            id: 27,
            name: '权杖六',
            nameEn: 'Six of Wands',
            number: '6',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '成功、公众认可、进步、自信',
                reversed: '傲慢、缺乏认可、失败'
            },
            element: '火',
            symbols: ['胜利者', '马匹', '花环', '权杖']
        },
        {
            id: 28,
            name: '权杖七',
            nameEn: 'Seven of Wands',
            number: '7',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '防御、坚持、立场、挑战',
                reversed: '不知所措、放弃、缺乏自信'
            },
            element: '火',
            symbols: ['高处的人', '六根权杖']
        },
        {
            id: 29,
            name: '权杖八',
            nameEn: 'Eight of Wands',
            number: '8',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '速度、行动、快速进展、旅行',
                reversed: '延迟、挫折、缺乏进展'
            },
            element: '火',
            symbols: ['八根飞行的权杖', '风景']
        },
        {
            id: 30,
            name: '权杖九',
            nameEn: 'Nine of Wands',
            number: '9',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '韧性、勇气、坚持、防御准备',
                reversed: '疲惫、缺乏信心、脆弱'
            },
            element: '火',
            symbols: ['受伤的人', '八根权杖', '绷带']
        },
        {
            id: 31,
            name: '权杖十',
            nameEn: 'Ten of Wands',
            number: '10',
            suit: 'wands',
            suitName: '权杖',
            meaning: {
                upright: '负担、过劳、责任、压力',
                reversed: '释放负担、委托、缺乏责任'
            },
            element: '火',
            symbols: ['背负十根权杖的人', '村庄']
        },
        {
            id: 32,
            name: '权杖侍从',
            nameEn: 'Page of Wands',
            number: 'P',
            suit: 'wands',
            suitName: '权杖',
            courtRank: 'page',
            meaning: {
                upright: '灵感、想法、探索、发现',
                reversed: '缺乏能量、停滞、缺乏焦点'
            },
            element: '火',
            symbols: ['年轻人', '权杖', '羽毛', '沙漠']
        },
        {
            id: 33,
            name: '权杖骑士',
            nameEn: 'Knight of Wands',
            number: 'K',
            suit: 'wands',
            suitName: '权杖',
            courtRank: 'knight',
            meaning: {
                upright: '行动、冒险、热情、自信',
                reversed: '冲动、缺乏方向、挫折'
            },
            element: '火',
            symbols: ['骑士', '马', '权杖', '火焰图案']
        },
        {
            id: 34,
            name: '权杖王后',
            nameEn: 'Queen of Wands',
            number: 'Q',
            suit: 'wands',
            suitName: '权杖',
            courtRank: 'queen',
            meaning: {
                upright: '自信、独立、温暖、领导力',
                reversed: '自私、不安全感、缺乏专注'
            },
            element: '火',
            symbols: ['王后', '权杖', '黑猫', '向日葵', '宝座']
        },
        {
            id: 35,
            name: '权杖国王',
            nameEn: 'King of Wands',
            number: 'K',
            suit: 'wands',
            suitName: '权杖',
            courtRank: 'king',
            meaning: {
                upright: '领导力、愿景、企业家精神、荣誉',
                reversed: '傲慢、冲动、控制欲'
            },
            element: '火',
            symbols: ['国王', '权杖', '狮子', '蝾螈', '宝座']
        }
    ],

    // 小阿卡纳 - 圣杯 (14张)
    cups: [
        {
            id: 36,
            name: '圣杯首牌',
            nameEn: 'Ace of Cups',
            number: 'A',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '新的情感、爱、灵感、直觉',
                reversed: '情感阻塞、缺乏爱、空虚'
            },
            element: '水',
            symbols: ['圣杯', '水', '鸽子', '云', '花朵']
        },
        {
            id: 37,
            name: '圣杯二',
            nameEn: 'Two of Cups',
            number: '2',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '伙伴关系、连接、和谐',
                reversed: '失衡、破裂的关系、缺乏和谐'
            },
            element: '水',
            symbols: ['两个圣杯', '两个人', ' Hermes 手杖', '狮子']
        },
        {
            id: 38,
            name: '圣杯三',
            nameEn: 'Three of Cups',
            number: '3',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '庆祝、友谊、社群、快乐',
                reversed: '过度享乐、孤立、缺乏社交'
            },
            element: '水',
            symbols: ['三个女人', '三个圣杯', '水果', '花环']
        },
        {
            id: 39,
            name: '圣杯四',
            nameEn: 'Four of Cups',
            number: '4',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '冥想、反思、冷漠、机会',
                reversed: '兴趣恢复、新的机会、觉醒'
            },
            element: '水',
            symbols: ['坐着的人', '三个圣杯', '一只手递杯']
        },
        {
            id: 40,
            name: '圣杯五',
            nameEn: 'Five of Cups',
            number: '5',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '失落、遗憾、悲伤、失望',
                reversed: '接受、向前看、找到平静'
            },
            element: '水',
            symbols: ['哭泣的人', '翻倒的杯子', '两个直立杯子', '河流']
        },
        {
            id: 41,
            name: '圣杯六',
            nameEn: 'Six of Cups',
            number: '6',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '怀旧、童年记忆、快乐、纯真',
                reversed: '活在过去、无法放手、不成熟'
            },
            element: '水',
            symbols: ['两个孩子', '六个圣杯', '花朵', '城堡']
        },
        {
            id: 42,
            name: '圣杯七',
            nameEn: 'Seven of Cups',
            number: '7',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '选择、幻觉、幻想、机会',
                reversed: '清晰的愿景、现实、做出选择'
            },
            element: '水',
            symbols: ['七个圣杯', '各种符号', '人', '云']
        },
        {
            id: 43,
            name: '圣杯八',
            nameEn: 'Eight of Cups',
            number: '8',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '离开、寻求意义、放手',
                reversed: '恐惧离开、停留太久、缺乏意义'
            },
            element: '水',
            symbols: ['行走的人', '八个圣杯', '月亮', '山脉']
        },
        {
            id: 44,
            name: '圣杯九',
            nameEn: 'Nine of Cups',
            number: '9',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '满足、愿望实现、自信、快乐',
                reversed: '不满、贪婪、愿望未实现'
            },
            element: '水',
            symbols: ['坐着的人', '九个圣杯', '宝座']
        },
        {
            id: 45,
            name: '圣杯十',
            nameEn: 'Ten of Cups',
            number: '10',
            suit: 'cups',
            suitName: '圣杯',
            meaning: {
                upright: '幸福、和谐、家庭、完成',
                reversed: '家庭冲突、缺乏和谐、不幸福'
            },
            element: '水',
            symbols: ['一家人', '十个圣杯', '彩虹', '家园']
        },
        {
            id: 46,
            name: '圣杯侍从',
            nameEn: 'Page of Cups',
            number: 'P',
            suit: 'cups',
            suitName: '圣杯',
            courtRank: 'page',
            meaning: {
                upright: '创造力、直觉、消息、敏感',
                reversed: '创作受阻、情绪不稳定、不成熟'
            },
            element: '水',
            symbols: ['年轻人', '圣杯', '鱼', '海', '花朵']
        },
        {
            id: 47,
            name: '圣杯骑士',
            nameEn: 'Knight of Cups',
            number: 'K',
            suit: 'cups',
            suitName: '圣杯',
            courtRank: 'knight',
            meaning: {
                upright: '浪漫、魅力、想象力、美',
                reversed: '情绪化、不切实际、不安全感'
            },
            element: '水',
            symbols: ['骑士', '马', '圣杯', '河流', '翅膀']
        },
        {
            id: 48,
            name: '圣杯王后',
            nameEn: 'Queen of Cups',
            number: 'Q',
            suit: 'cups',
            suitName: '圣杯',
            courtRank: 'queen',
            meaning: {
                upright: '同情、直觉、情感智慧、治愈',
                reversed: '过度情绪化、不安全感、依赖'
            },
            element: '水',
            symbols: ['王后', '圣杯', '贝壳', '海洋', '宝座']
        },
        {
            id: 49,
            name: '圣杯国王',
            nameEn: 'King of Cups',
            number: 'K',
            suit: 'cups',
            suitName: '圣杯',
            courtRank: 'king',
            meaning: {
                upright: '情感平衡、同情、智慧、冷静',
                reversed: '情绪操控、不成熟、缺乏情感'
            },
            element: '水',
            symbols: ['国王', '圣杯', '鱼', '船只', '宝座']
        }
    ],

    // 小阿卡纳 - 宝剑 (14张)
    swords: [
        {
            id: 50,
            name: '宝剑首牌',
            nameEn: 'Ace of Swords',
            number: 'A',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '清晰、突破、新思想、心智力量',
                reversed: '混乱、思维受阻、缺乏清晰'
            },
            element: '气',
            symbols: ['手中的剑', '皇冠', '云', '花朵', '橄榄枝']
        },
        {
            id: 51,
            name: '宝剑二',
            nameEn: 'Two of Swords',
            number: '2',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '困难的决策、僵持、避免真相',
                reversed: '信息不足、做出决定、焦虑减轻'
            },
            element: '气',
            symbols: ['蒙眼的人', '两把剑', '月亮', '水']
        },
        {
            id: 52,
            name: '宝剑三',
            nameEn: 'Three of Swords',
            number: '3',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '心碎、痛苦、悲伤、伤害',
                reversed: '恢复、释放痛苦、继续前进'
            },
            element: '气',
            symbols: ['三把剑', '心', '雨', '云']
        },
        {
            id: 53,
            name: '宝剑四',
            nameEn: 'Four of Swords',
            number: '4',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '休息、恢复、反思、休整',
                reversed: '恢复活动、缺乏休息、紧张'
            },
            element: '气',
            symbols: ['躺下的人', '三把剑', '墙上挂剑', '彩色玻璃窗']
        },
        {
            id: 54,
            name: '宝剑五',
            nameEn: 'Five of Swords',
            number: '5',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '冲突、失败、背叛、空胜利',
                reversed: '放下冲突、走向和解、自尊'
            },
            element: '气',
            symbols: ['胜利者', '失败者', '五把剑', '云']
        },
        {
            id: 55,
            name: '宝剑六',
            nameEn: 'Six of Swords',
            number: '6',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '过渡、离开困境、向平静移动',
                reversed: '抵抗改变、停留在痛苦中'
            },
            element: '气',
            symbols: ['船', '六把剑', '水', '岸边', '天空']
        },
        {
            id: 56,
            name: '宝剑七',
            nameEn: 'Seven of Swords',
            number: '7',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '欺骗、狡猾、策略、逃避',
                reversed: '被欺骗、承认错误、改变策略'
            },
            element: '气',
            symbols: ['偷剑的人', '五把剑', '营地', '两把剑']
        },
        {
            id: 57,
            name: '宝剑八',
            nameEn: 'Eight of Swords',
            number: '8',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '束缚、限制、自我囚禁、受害者心态',
                reversed: '释放束缚、开放思维、摆脱恐惧'
            },
            element: '气',
            symbols: ['被绑的人', '八把剑', '城堡', '撕裂的布']
        },
        {
            id: 58,
            name: '宝剑九',
            nameEn: 'Nine of Swords',
            number: '9',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '焦虑、担忧、恐惧、噩梦',
                reversed: '释放焦虑、从恐惧中恢复、内心平静'
            },
            element: '气',
            symbols: ['惊醒的人', '九把剑', '墙壁', '床']
        },
        {
            id: 59,
            name: '宝剑十',
            nameEn: 'Ten of Swords',
            number: '10',
            suit: 'swords',
            suitName: '宝剑',
            meaning: {
                upright: '痛苦的结束、背叛、危机、底部',
                reversed: '从痛苦中恢复、黎明、新开始'
            },
            element: '气',
            symbols: ['被刺的人', '十把剑', '黎明', '天空']
        },
        {
            id: 60,
            name: '宝剑侍从',
            nameEn: 'Page of Swords',
            number: 'P',
            suit: 'swords',
            suitName: '宝剑',
            courtRank: 'page',
            meaning: {
                upright: '好奇心、监视、新想法、沟通',
                reversed: '八卦、评判、缺乏专注、不诚实'
            },
            element: '气',
            symbols: ['年轻人', '剑', '风', '鸟', '云']
        },
        {
            id: 61,
            name: '宝剑骑士',
            nameEn: 'Knight of Swords',
            number: 'K',
            suit: 'swords',
            suitName: '宝剑',
            courtRank: 'knight',
            meaning: {
                upright: '野心、行动、追求、逻辑',
                reversed: '鲁莽、冷漠、残忍、冲动'
            },
            element: '气',
            symbols: ['骑士', '马', '剑', '风', '鸟']
        },
        {
            id: 62,
            name: '宝剑王后',
            nameEn: 'Queen of Swords',
            number: 'Q',
            suit: 'swords',
            suitName: '宝剑',
            courtRank: 'queen',
            meaning: {
                upright: '清晰、独立、直接、诚实',
                reversed: '孤立、冷漠、伤人的言语'
            },
            element: '气',
            symbols: ['王后', '剑', '云', '鸟', '宝座']
        },
        {
            id: 63,
            name: '宝剑国王',
            nameEn: 'King of Swords',
            number: 'K',
            suit: 'swords',
            suitName: '宝剑',
            courtRank: 'king',
            meaning: {
                upright: '心智清晰、权威、逻辑、真理',
                reversed: '操控、滥用权力、冷漠'
            },
            element: '气',
            symbols: ['国王', '剑', '云', '鸟', '宝座']
        }
    ],

    // 小阿卡纳 - 星币 (14张)
    pentacles: [
        {
            id: 64,
            name: '星币首牌',
            nameEn: 'Ace of Pentacles',
            number: 'A',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '新的财务机会、丰盛、繁荣',
                reversed: '错失机会、财务损失、缺乏投资'
            },
            element: '土',
            symbols: ['手中的星币', '花园', '云', '花朵', '小径']
        },
        {
            id: 65,
            name: '星币二',
            nameEn: 'Two of Pentacles',
            number: '2',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '平衡、适应、时间管理、优先级',
                reversed: '失衡、过载、缺乏优先级'
            },
            element: '土',
            symbols: ['杂耍的人', '两个星币', '船只', '波浪']
        },
        {
            id: 66,
            name: '星币三',
            nameEn: 'Three of Pentacles',
            number: '3',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '团队合作、协作、技能、工作',
                reversed: '缺乏合作、低质量工作、冲突'
            },
            element: '土',
            symbols: ['三个工匠', '三个星币', '教堂', '工具']
        },
        {
            id: 67,
            name: '星币四',
            nameEn: 'Four of Pentacles',
            number: '4',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '储蓄、安全、保守、占有',
                reversed: '贪婪、花费、缺乏安全感、慷慨'
            },
            element: '土',
            symbols: ['抱着星币的人', '一个星币在头上', '两个脚下的星币', '城市']
        },
        {
            id: 68,
            name: '星币五',
            nameEn: 'Five of Pentacles',
            number: '5',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '财务困难、贫穷、缺乏资源、困境',
                reversed: '从贫困中恢复、找到帮助、精神富足'
            },
            element: '土',
            symbols: ['两个人', '五个星币', '雪', '教堂窗户']
        },
        {
            id: 69,
            name: '星币六',
            nameEn: 'Six of Pentacles',
            number: '6',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '慷慨、慈善、分享财富、给予',
                reversed: '自私、债务、不平等、权力动态'
            },
            element: '土',
            symbols: ['给钱的人', '两个乞丐', '天平', '六个星币']
        },
        {
            id: 70,
            name: '星币七',
            nameEn: 'Seven of Pentacles',
            number: '7',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '耐心、投资、长期愿景、等待结果',
                reversed: '缺乏耐心、努力未获回报、评估'
            },
            element: '土',
            symbols: ['农夫', '植物', '七个星币', '花园']
        },
        {
            id: 71,
            name: '星币八',
            nameEn: 'Eight of Pentacles',
            number: '8',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '技能发展、勤奋、专注、工匠精神',
                reversed: '缺乏技能、偷懒、工作质量差'
            },
            element: '土',
            symbols: ['工匠', '八个星币', '工作台', '工具']
        },
        {
            id: 72,
            name: '星币九',
            nameEn: 'Nine of Pentacles',
            number: '9',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '丰盛、奢侈、自给自足、独立',
                reversed: '过度消费、缺乏独立、财务不稳定'
            },
            element: '土',
            symbols: ['女人', '九个星币', '葡萄', '鸟', '花园']
        },
        {
            id: 73,
            name: '星币十',
            nameEn: 'Ten of Pentacles',
            number: '10',
            suit: 'pentacles',
            suitName: '星币',
            meaning: {
                upright: '财富、家族遗产、长期成功、稳定性',
                reversed: '财务失控、家庭冲突、失去遗产'
            },
            element: '土',
            symbols: ['三代人', '十个星币', '城堡', '狗', '家族纹章']
        },
        {
            id: 74,
            name: '星币侍从',
            nameEn: 'Page of Pentacles',
            number: 'P',
            suit: 'pentacles',
            suitName: '星币',
            courtRank: 'page',
            meaning: {
                upright: '雄心、勤奋、学习、专注',
                reversed: '缺乏专注、学习困难、不切实际'
            },
            element: '土',
            symbols: ['年轻人', '星币', '田野', '小径', '山脉']
        },
        {
            id: 75,
            name: '星币骑士',
            nameEn: 'Knight of Pentacles',
            number: 'K',
            suit: 'pentacles',
            suitName: '星币',
            courtRank: 'knight',
            meaning: {
                upright: '勤奋、可靠、耐心、实用主义',
                reversed: '固执、慢速、缺乏灵活性、枯燥'
            },
            element: '土',
            symbols: ['骑士', '马', '星币', '田野', '树木']
        },
        {
            id: 76,
            name: '星币王后',
            nameEn: 'Queen of Pentacles',
            number: 'Q',
            suit: 'pentacles',
            suitName: '星币',
            courtRank: 'queen',
            meaning: {
                upright: '养育、务实、富裕、慷慨',
                reversed: '自我忽视、不安全感、物质主义'
            },
            element: '土',
            symbols: ['王后', '星币', '兔子', '花朵', '花园', '宝座']
        },
        {
            id: 77,
            name: '星币国王',
            nameEn: 'King of Pentacles',
            number: 'K',
            suit: 'pentacles',
            suitName: '星币',
            courtRank: 'king',
            meaning: {
                upright: '成功、财富、商业、领导力',
                reversed: '贪婪、腐败、控制欲、物质主义'
            },
            element: '土',
            symbols: ['国王', '星币', '葡萄', '城堡', '牛', '宝座']
        }
    ]
};

// 获取所有卡牌
function getAllCards() {
    return [
        ...TAROT_DATA.majorArcana,
        ...TAROT_DATA.wands,
        ...TAROT_DATA.cups,
        ...TAROT_DATA.swords,
        ...TAROT_DATA.pentacles
    ];
}

// 获取大阿卡纳
function getMajorArcana() {
    return TAROT_DATA.majorArcana;
}

// 获取小阿卡纳
function getMinorArcana() {
    return [
        ...TAROT_DATA.wands,
        ...TAROT_DATA.cups,
        ...TAROT_DATA.swords,
        ...TAROT_DATA.pentacles
    ];
}

// 按花色获取卡牌
function getCardsBySuit(suit) {
    switch(suit) {
        case 'wands':
            return TAROT_DATA.wands;
        case 'cups':
            return TAROT_DATA.cups;
        case 'swords':
            return TAROT_DATA.swords;
        case 'pentacles':
            return TAROT_DATA.pentacles;
        case 'major':
            return TAROT_DATA.majorArcana;
        default:
            return getAllCards();
    }
}

// 通过ID获取卡牌
function getCardById(id) {
    return getAllCards().find(card => card.id === id);
}

// 获取卡牌总数
function getTotalCards() {
    return getAllCards().length;
}

// 导出到全局
window.TAROT_DATA = TAROT_DATA;
window.getAllCards = getAllCards;
window.getMajorArcana = getMajorArcana;
window.getMinorArcana = getMinorArcana;
window.getCardsBySuit = getCardsBySuit;
window.getCardById = getCardById;
window.getTotalCards = getTotalCards;
