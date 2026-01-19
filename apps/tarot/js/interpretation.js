// 塔罗解读系统
class InterpretationManager {
    constructor() {
        this.currentReading = null;
        this.interpretationHistory = [];
    }

    // 生成解读
    generateInterpretation(spreadCards, spreadInfo) {
        const reading = {
            spread: spreadInfo,
            cards: [],
            overall: '',
            timestamp: new Date().toISOString()
        };

        // 为每张卡牌生成解读
        spreadCards.forEach((card, index) => {
            const position = spreadInfo.positions[index];
            const cardInterpretation = this.interpretCard(card, position);
            reading.cards.push(cardInterpretation);
        });

        // 生成整体解读
        reading.overall = this.generateOverallReading(reading.cards, spreadInfo);

        this.currentReading = reading;
        this.interpretationHistory.push(reading);

        return reading;
    }

    // 解读单张卡牌
    interpretCard(card, position) {
        const isReversed = Math.random() > 0.7; // 30% 概率逆位
        const meaning = isReversed
            ? card.data.meaning.reversed
            : card.data.meaning.upright;

        return {
            card: card.data,
            position: position.name,
            isReversed,
            meaning,
            interpretation: this.detailedInterpretation(card, position, isReversed),
            advice: this.generateAdvice(card, position, isReversed)
        };
    }

    // 详细解读
    detailedInterpretation(card, position, isReversed) {
        const cardName = card.data.name;
        const positionName = position.name;
        const meaning = isReversed
            ? card.data.meaning.reversed
            : card.data.meaning.upright;

        // 根据位置生成不同的解读
        let interpretation = '';

        switch(positionName) {
            case '过去':
                interpretation = `${cardName}逆位${isReversed ? '（逆位）' : ''}显示，${meaning}。这一能量影响了你的过去经历。`;
                break;
            case '现在':
                interpretation = `目前，${cardName}${isReversed ? '（逆位）' : ''}指出${meaning}。这是你当前处境的关键。`;
                break;
            case '未来':
                interpretation = `${cardName}${isReversed ? '（逆位）' : ''}暗示未来可能${meaning}。保持警觉和准备。`;
                break;
            case '挑战':
                interpretation = `你需要面对的挑战是${meaning}。${cardName}${isReversed ? '（逆位）' : ''}提醒你注意这一点。`;
                break;
            case '建议':
                interpretation = `${cardName}给出的建议是：${meaning}。考虑如何将这一智慧应用到你的情况中。`;
                break;
            case '结果':
                interpretation = `如果按照当前的路径发展，结果可能${meaning}。${cardName}${isReversed ? '（逆位）' : ''}提醒你这一点。`;
                break;
            default:
                interpretation = `在${positionName}位置上，${cardName}${isReversed ? '（逆位）' : ''}表示${meaning}。`;
        }

        return interpretation;
    }

    // 生成建议
    generateAdvice(card, position, isReversed) {
        const adviceTemplates = [
            `这张牌建议你关注${card.data.element}元素相关的能量。`,
            `考虑${card.data.symbols.slice(0, 2).join('和')}的象征意义。`,
            isReversed
                ? `逆位提醒你需要反思和调整方向。`
                : `正位显示你走在正确的道路上。`,
            `记住，塔罗牌提供指导，最终决定权在你手中。`
        ];

        return adviceTemplates[Math.floor(Math.random() * adviceTemplates.length)];
    }

    // 生成整体解读
    generateOverallReading(cardReadings, spreadInfo) {
        const spreadName = spreadInfo.name;
        const cards = cardReadings.map(r => r.card);
        const reversedCount = cardReadings.filter(r => r.isReversed).length;

        let overall = `【${spreadName}解读】\n\n`;

        // 分析牌面组合
        const suitCount = this.analyzeSuits(cards);
        const elementCount = this.analyzeElements(cards);
        const majorCount = cards.filter(c => c.suit === 'major').length;

        // 大阿卡纳比例
        if (majorCount > cards.length / 2) {
            overall += '这张牌阵中有大量大阿卡纳，表明当前情况具有深刻的精神意义和命运色彩。\n\n';
        }

        // 元素分析
        const dominantElement = Object.entries(elementCount)
            .sort((a, b) => b[1] - a[1])[0];

        if (dominantElement && dominantElement[1] > 0) {
            const elementNames = {
                '火': '行动力和激情',
                '水': '情感和直觉',
                '气': '思想和沟通',
                '土': '物质和实际',
                'major': '精神力量'
            };
            overall += `主导元素是${dominantElement[0]}，强调${elementNames[dominantElement[0]]}在这一情况中的重要性。\n\n`;
        }

        // 逆位分析
        if (reversedCount > cards.length / 2) {
            overall += `这张牌阵中有${reversedCount}张逆位牌，表明存在许多需要反思和调整的方面。\n\n`;
        }

        // 综合建议
        overall += '【综合建议】\n';
        overall += this.generateFinalAdvice(cardReadings, spreadInfo);

        return overall;
    }

    // 分析花色分布
    analyzeSuits(cards) {
        const suits = {};
        cards.forEach(card => {
            if (card.suit !== 'major') {
                suits[card.suit] = (suits[card.suit] || 0) + 1;
            }
        });
        return suits;
    }

    // 分析元素分布
    analyzeElements(cards) {
        const elements = {};
        cards.forEach(card => {
            const element = card.element || card.suit;
            elements[element] = (elements[element] || 0) + 1;
        });
        return elements;
    }

    // 生成最终建议
    generateFinalAdvice(cardReadings, spreadInfo) {
        const advice = [];

        // 从每张牌提取关键建议
        cardReadings.forEach(reading => {
            const keywords = reading.meaning.split('、').slice(0, 2);
            advice.push(`${reading.position}：关注${keywords.join('和')}`);
        });

        return advice.join('\n') + '\n\n信任你的直觉，塔罗牌为你指明方向，但你的选择创造未来。';
    }

    // 格式化解读为HTML
    formatAsHTML(reading) {
        let html = '<div class="interpretation">';

        // 标题
        html += `<h2 class="interpretation-title">${reading.spread.name}</h2>`;
        html += `<p class="interpretation-subtitle">${reading.spread.description}</p>`;

        // 卡牌解读
        html += '<div class="cards-interpretation">';
        reading.cards.forEach((cardReading, index) => {
            html += `
                <div class="card-reading" data-index="${index}">
                    <h3 class="card-position">${cardReading.position}</h3>
                    <div class="card-info">
                        <span class="card-name">${cardReading.card.name}</span>
                        <span class="card-reversed ${cardReading.isReversed ? 'active' : ''}">
                            ${cardReading.isReversed ? '(逆位)' : '(正位)'}
                        </span>
                    </div>
                    <p class="card-meaning">${cardReading.meaning}</p>
                    <div class="card-interpretation">${cardReading.interpretation}</div>
                    <div class="card-advice">
                        <strong>建议：</strong>${cardReading.advice}
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // 整体解读
        html += `
            <div class="overall-reading">
                <h3>整体解读</h3>
                <div class="overall-content">${reading.overall.replace(/\n/g, '<br>')}</div>
            </div>
        `;

        html += '</div>';
        return html;
    }

    // 格式化解读为纯文本
    formatAsText(reading) {
        let text = `=== ${reading.spread.name} ===\n`;
        text += `${reading.spread.description}\n\n`;

        reading.cards.forEach((cardReading, index) => {
            text += `【${cardReading.position}】\n`;
            text += `${cardReading.card.name} ${cardReading.isReversed ? '(逆位)' : '(正位)'}\n`;
            text += `含义：${cardReading.meaning}\n`;
            text += `解读：${cardReading.interpretation}\n`;
            text += `建议：${cardReading.advice}\n\n`;
        });

        text += `【整体解读】\n${reading.overall}\n`;

        return text;
    }

    // 获取当前解读
    getCurrentReading() {
        return this.currentReading;
    }

    // 获取解读历史
    getHistory() {
        return this.interpretationHistory;
    }

    // 清除历史
    clearHistory() {
        this.interpretationHistory = [];
    }

    // 保存解读到本地存储
    saveToLocalStorage() {
        try {
            const history = this.interpretationHistory.slice(-20); // 只保存最近20次
            localStorage.setItem('tarotReadings', JSON.stringify(history));
            return true;
        } catch (e) {
            console.error('Failed to save readings:', e);
            return false;
        }
    }

    // 从本地存储加载解读
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('tarotReadings');
            if (saved) {
                this.interpretationHistory = JSON.parse(saved);
                return true;
            }
        } catch (e) {
            console.error('Failed to load readings:', e);
        }
        return false;
    }

    // 导出解读
    exportReading(reading, format = 'text') {
        let content, filename, type;

        if (format === 'html') {
            content = this.formatAsHTML(reading);
            filename = `tarot-reading-${Date.now()}.html`;
            type = 'text/html';
        } else {
            content = this.formatAsText(reading);
            filename = `tarot-reading-${Date.now()}.txt`;
            type = 'text/plain';
        }

        // 创建下载链接
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// 关键词提取器
class KeywordExtractor {
    constructor() {
        this.keywords = {
            positive: [
                '成功', '成长', '爱情', '幸福', '和谐', '创造', '力量',
                '智慧', '希望', '平衡', '繁荣', '治愈', '灵感', '勇气'
            ],
            negative: [
                '挑战', '困难', '分离', '失败', '恐惧', '焦虑', '痛苦',
                '冲突', '失去', '阻碍', '混乱', '背叛', '孤独'
            ],
            neutral: [
                '变化', '选择', '等待', '反思', '过渡', '学习', '探索',
                '准备', '适应', '观察', '理解', '接受'
            ]
        };
    }

    // 从解读中提取关键词
    extract(reading) {
        const found = {
            positive: [],
            negative: [],
            neutral: []
        };

        reading.cards.forEach(cardReading => {
            const meaning = cardReading.meaning;
            Object.entries(this.keywords).forEach(([type, keywords]) => {
                keywords.forEach(keyword => {
                    if (meaning.includes(keyword) && !found[type].includes(keyword)) {
                        found[type].push(keyword);
                    }
                });
            });
        });

        return found;
    }
}

// 导出到全局
window.InterpretationManager = InterpretationManager;
window.KeywordExtractor = KeywordExtractor;
