/**
 * 单词库数据
 * 包含所有可用的中英文单词对
 */
const wordPairs = [
    // 水果类
    { chinese: '苹果', english: 'Apple' },
    { chinese: '香蕉', english: 'Banana' },
    { chinese: '橙子', english: 'Orange' },
    { chinese: '葡萄', english: 'Grape' },
    { chinese: '西瓜', english: 'Watermelon' },
    { chinese: '草莓', english: 'Strawberry' },

    // 电子产品类
    { chinese: '电脑', english: 'Computer' },
    { chinese: '手机', english: 'Phone' },
    { chinese: '平板', english: 'Tablet' },
    { chinese: '键盘', english: 'Keyboard' },
    { chinese: '鼠标', english: 'Mouse' },

    // 学习用品类
    { chinese: '书籍', english: 'Book' },
    { chinese: '钢笔', english: 'Pen' },
    { chinese: '铅笔', english: 'Pencil' },
    { chinese: '橡皮', english: 'Eraser' },
    { chinese: '尺子', english: 'Ruler' },

    // 家具类
    { chinese: '桌子', english: 'Table' },
    { chinese: '椅子', english: 'Chair' },
    { chinese: '沙发', english: 'Sofa' },
    { chinese: '床', english: 'Bed' },

    // 职业类
    { chinese: '老师', english: 'Teacher' },
    { chinese: '学生', english: 'Student' },
    { chinese: '医生', english: 'Doctor' },
    { chinese: '护士', english: 'Nurse' },
    { chinese: '警察', english: 'Police' },
    { chinese: '司机', english: 'Driver' },

    // 动物类
    { chinese: '猫', english: 'Cat' },
    { chinese: '狗', english: 'Dog' },
    { chinese: '鸟', english: 'Bird' },
    { chinese: '鱼', english: 'Fish' },
    { chinese: '兔子', english: 'Rabbit' },
    { chinese: '老虎', english: 'Tiger' },

    // 自然类
    { chinese: '太阳', english: 'Sun' },
    { chinese: '月亮', english: 'Moon' },
    { chinese: '星星', english: 'Star' },
    { chinese: '云', english: 'Cloud' },
    { chinese: '雨', english: 'Rain' },
    { chinese: '雪', english: 'Snow' },

    // 颜色类
    { chinese: '红色', english: 'Red' },
    { chinese: '蓝色', english: 'Blue' },
    { chinese: '绿色', english: 'Green' },
    { chinese: '黄色', english: 'Yellow' },

    // 食物类
    { chinese: '面包', english: 'Bread' },
    { chinese: '牛奶', english: 'Milk' },
    { chinese: '鸡蛋', english: 'Egg' },
    { chinese: '米饭', english: 'Rice' }
];

/**
 * 工具函数: 随机打乱数组
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * 从单词库中随机获取指定数量的单词对
 */
function getRandomPairs(count) {
    const shuffled = shuffleArray(wordPairs);
    return shuffled.slice(0, count);
}

/**
 * 根据单词对创建卡片数据
 */
function createWordCards(pair) {
    return [
        { id: `${pair.english}-cn`, text: pair.chinese, pairId: pair.english, type: 'chinese' },
        { id: `${pair.english}-en`, text: pair.english, pairId: pair.english, type: 'english' }
    ];
}