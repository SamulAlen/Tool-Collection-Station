/**
 * 工具集合站配置文件
 * 定义所有子应用的路径和元数据
 */

const APP_CONFIG = {
    // 子应用配置（按顺序排列）
    apps: {
        notepoint: {
            id: 'notepoint',
            name: '节点知识库',
            icon: '📝',
            path: 'apps/notepoint/index.html',
            description: '知识关系图谱可视化工具'
        },
        game: {
            id: 'game',
            name: '单词消消乐',
            icon: '🎮',
            path: 'apps/game/index.html',
            description: '中英文单词配对游戏'
        },
        converter: {
            id: 'converter',
            name: '货币转换器',
            icon: '💱',
            path: 'apps/converter/index.html',
            description: '实时汇率转换工具'
        },
        timer: {
            id: 'timer',
            name: '番茄计时器',
            icon: '🍅',
            path: 'apps/timer/index.html',
            description: '番茄工作法计时器'
        },
        tarot: {
            id: 'tarot',
            name: '神秘塔罗',
            icon: '🔮',
            path: 'apps/tarot/index.html',
            description: '探索命运的奥秘'
        },
        fire: {
            id: 'fire',
            name: '烟花秀',
            icon: '🎆',
            path: 'apps/fire/index.html',
            description: '绚丽多彩的烟花秀表演'
        },
        about: {
            id: 'about',
            name: '关于',
            icon: '👤',
            path: 'apps/about/index.html',
            description: '关于本站'
        }
    },

    // 默认应用
    defaultApp: 'notepoint',

    // 站点信息
    siteInfo: {
        title: '工具集合站',
        subtitle: '你的在线工具箱',
        version: '1.0.0'
    }
};

// 防止被意外修改
Object.freeze(APP_CONFIG);
