// ===================================
// 简历数据
// ===================================

const RESUME_DATA = {
    // 个人信息
    profile: {
        name: 'Samul Austin',
        title: '高级软件开发工程师',
        email: 'liuxinwangsa@example.com',
        phone: '+86 138-0000-0000',
        location: '中国·北京',
        avatar: 'images/avatar.png',
        bio: '拥有5年以上的软件开发经验，专注于构建高性能、可扩展的Web应用。精通现代前端技术栈，同时具备深厚的后端开发能力。我相信优秀的产品需要精湛的技术与良好的用户体验相结合。',
        resume: 'documents/resume.pdf'
    },

    // 社交链接
    social: {
        github: 'https://github.com/samulalen',
        linkedin: 'https://linkedin.com/in/samulalen',
        twitter: 'https://twitter.com/samulalen',
        email: 'mailto:liuxinwangsa@example.com',
        wechat: 'lxw15178182521'
    },

    // 统计数据
    stats: {
        years: 5,
        projects: 50,
        clients: 20,
        coffee: 1000
    },

    // 工作经历
    experience: [
        {
            id: 1,
            company: '科技创新有限公司',
            position: '高级软件工程师',
            period: '2022 - 至今',
            location: '北京',
            description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。',
            achievements: [
                '主导重构公司核心产品，提升性能40%',
                '设计并实现组件库，提高开发效率30%',
                '优化 CI/CD 流程，部署时间缩短50%',
                '指导初级工程师，进行代码审查'
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS']
        },
        {
            id: 2,
            company: '互联网科技公司',
            position: '全栈开发工程师',
            period: '2020 - 2022',
            location: '上海',
            description: '参与多个Web应用的全栈开发，负责从需求分析到部署上线的完整流程。',
            achievements: [
                '独立完成电商平台前端开发，支持日均10万+访问',
                '开发实时通讯系统，使用WebSocket技术',
                '优化数据库查询，响应时间减少60%',
                '搭建监控系统，提高系统稳定性'
            ],
            skills: ['Vue.js', 'Express.js', 'MongoDB', 'Redis', 'Nginx']
        },
        {
            id: 3,
            company: '软件开发工作室',
            position: '前端开发工程师',
            period: '2018 - 2020',
            location: '深圳',
            description: '负责客户项目的前端开发工作，与设计团队紧密合作实现优质用户体验。',
            achievements: [
                '完成20+个客户项目，获得高度评价',
                '开发响应式设计系统，支持多端适配',
                '实现复杂动画效果，提升用户体验',
                '优化移动端性能，首屏加载时间减少40%'
            ],
            skills: ['JavaScript', 'HTML5', 'CSS3', 'Webpack', 'Git']
        }
    ],

    // 教育背景
    education: [
        {
            id: 1,
            school: '清华大学',
            degree: '计算机科学与技术 硕士',
            period: '2016 - 2018',
            description: '主修软件工程、分布式系统、机器学习等课程，GPA 3.8/4.0',
            honors: ['优秀研究生', '国家奖学金']
        },
        {
            id: 2,
            school: '北京理工大学',
            degree: '软件工程 学士',
            period: '2012 - 2016',
            description: '主修软件开发、数据库原理、计算机网络等课程，GPA 3.6/4.0',
            honors: ['优秀毕业生', '三好学生']
        }
    ],

    // 技能
    skills: {
        frontend: [
            { name: 'JavaScript', level: 95, icon: 'javascript.svg', color: '#F7DF1E' },
            { name: 'TypeScript', level: 90, icon: 'typescript.svg', color: '#3178C6' },
            { name: 'React', level: 92, icon: 'react.svg', color: '#61DAFB' },
            { name: 'Vue.js', level: 88, icon: 'vue.svg', color: '#4FC08D' },
            { name: 'HTML5', level: 95, icon: 'html5.svg', color: '#E34F26' },
            { name: 'CSS3', level: 92, icon: 'css3.svg', color: '#1572B6' },
            { name: 'Next.js', level: 85, icon: 'nextjs.svg', color: '#000000' }
        ],
        backend: [
            { name: 'Node.js', level: 90, icon: 'nodejs.svg', color: '#339933' },
            { name: 'Python', level: 85, icon: 'python.svg', color: '#3776AB' },
            { name: 'Express.js', level: 88, icon: 'express.svg', color: '#000000' },
            { name: 'MongoDB', level: 82, icon: 'mongodb.svg', color: '#47A248' },
            { name: 'PostgreSQL', level: 80, icon: 'postgresql.svg', color: '#336791' },
            { name: 'Redis', level: 78, icon: 'redis.svg', color: '#DC382D' }
        ],
        tools: [
            { name: 'Git', level: 92, icon: 'git.svg', color: '#F05032' },
            { name: 'Docker', level: 85, icon: 'docker.svg', color: '#2496ED' },
            { name: 'AWS', level: 80, icon: 'aws.svg', color: '#FF9900' },
            { name: 'Webpack', level: 82, icon: 'webpack.svg', color: '#8DD6F9' },
            { name: 'VS Code', level: 95, icon: 'vscode.svg', color: '#007ACC' },
            { name: 'Figma', level: 75, icon: 'figma.svg', color: '#F24E1E' }
        ],
        other: [
            { name: 'REST API', level: 90, icon: 'api.svg', color: '#6DB33F' },
            { name: 'GraphQL', level: 80, icon: 'graphql.svg', color: '#E10098' },
            { name: 'CI/CD', level: 85, icon: 'cicd.svg', color: '#00A4E4' },
            { name: 'Testing', level: 82, icon: 'testing.svg', color: '#A52C2C' }
        ]
    },

    // 项目作品
    projects: [
        {
            id: 1,
            title: '多国货币转换器',
            description: '一个实时货币转换应用，支持150+种货币，提供历史汇率图表和转换提醒功能。',
            image: 'images/projects/currency-converter.png',
            tech: ['JavaScript', 'HTML5', 'CSS3'],
            link: '../多国货币转换器/converter.html',
            github: 'https://github.com/zhangsan/currency-converter',
            featured: true,
            stats: {
                stars: 128,
                forks: 45,
                users: '10K+'
            }
        },
        {
            id: 2,
            title: '番茄计时器',
            description: '基于番茄工作法的时间管理应用，帮助用户提高工作效率，支持任务管理和数据统计。',
            image: 'images/projects/pomodoro.png',
            tech: ['JavaScript', 'LocalStorage', 'CSS3'],
            link: '../番茄计时器/index.html',
            github: 'https://github.com/zhangsan/pomodoro',
            featured: true,
            stats: {
                stars: 256,
                forks: 78,
                users: '50K+'
            }
        },
        {
            id: 3,
            title: '中英文单词消消乐',
            description: '寓教于乐的单词学习游戏，通过消除游戏方式帮助用户记忆英语单词。',
            image: 'images/projects/word-game.png',
            tech: ['JavaScript', 'Canvas', 'Game Dev'],
            link: '../中英文单词消消乐/index.html',
            github: 'https://github.com/zhangsan/word-game',
            featured: false
        },
        {
            id: 4,
            title: '企业级后台管理系统',
            description: '功能完整的后台管理模板，包含权限管理、数据可视化、表单处理等核心功能。',
            image: 'images/projects/admin-dashboard.png',
            tech: ['React', 'Ant Design', 'ECharts'],
            link: 'https://admin.demo',
            github: 'https://github.com/zhangsan/admin-dashboard',
            featured: true,
            stats: {
                stars: 512,
                forks: 234,
                users: '100K+'
            }
        },
        {
            id: 5,
            title: '实时协作平台',
            description: '支持多人实时协作的在线平台，包含文档编辑、视频会议、任务管理等功能。',
            image: 'images/projects/collaboration.png',
            tech: ['Socket.io', 'Express', 'MongoDB'],
            link: 'https://collab.demo',
            github: 'https://github.com/zhangsan/collaboration',
            featured: false
        },
        {
            id: 6,
            title: '个人博客系统',
            description: '基于 Markdown 的静态博客生成器，支持主题定制和插件扩展。',
            image: 'images/projects/blog.png',
            tech: ['Next.js', 'MDX', 'Tailwind CSS'],
            link: 'https://blog.demo',
            github: 'https://github.com/zhangsan/blog',
            featured: false
        }
    ],

    // 博客文章
    blog: [
        {
            id: 1,
            title: 'React 18 并发模式深度解析',
            date: '2025-01-10',
            excerpt: '深入探讨 React 18 的并发模式特性，包括 Suspense、Transitions 和自动批处理等新功能。',
            url: 'https://blog.example.com/react-18-concurrent-mode',
            category: 'React',
            readTime: '8 min'
        },
        {
            id: 2,
            title: 'TypeScript 高级类型技巧',
            date: '2025-01-05',
            excerpt: '分享一些 TypeScript 高级类型使用技巧，帮助你编写更类型安全的代码。',
            url: 'https://blog.example.com/typescript-advanced-types',
            category: 'TypeScript',
            readTime: '6 min'
        },
        {
            id: 3,
            title: '前端性能优化最佳实践',
            date: '2024-12-28',
            excerpt: '总结前端性能优化的各种方法和工具，帮助你构建更快的 Web 应用。',
            url: 'https://blog.example.com/frontend-performance',
            category: '性能优化',
            readTime: '10 min'
        },
        {
            id: 4,
            title: 'WebSocket 实时通信实现指南',
            date: '2024-12-20',
            excerpt: '详细介绍如何使用 WebSocket 实现实时通信，包含完整的示例代码。',
            url: 'https://blog.example.com/websocket-guide',
            category: '后端开发',
            readTime: '12 min'
        },
        {
            id: 5,
            title: 'CSS Grid 与 Flexbox 的选择指南',
            date: '2024-12-15',
            excerpt: '深入比较 CSS Grid 和 Flexbox，帮助你在不同场景下选择合适的布局方案。',
            url: 'https://blog.example.com/css-grid-vs-flexbox',
            category: 'CSS',
            readTime: '7 min'
        },
        {
            id: 6,
            title: 'Node.js 微服务架构实践',
            date: '2024-12-10',
            excerpt: '分享使用 Node.js 构建微服务架构的实践经验，包含服务发现、负载均衡等。',
            url: 'https://blog.example.com/nodejs-microservices',
            category: 'Node.js',
            readTime: '15 min'
        }
    ],

    // 推荐语
    testimonials: [
        {
            id: 1,
            name: '李四',
            position: '技术总监',
            company: '科技创新有限公司',
            avatar: 'LS',
            content: '张三是我们团队中最出色的工程师之一，他的技术能力和解决问题的能力都非常出色。与他合作是一次非常愉快的经历。',
            rating: 5
        },
        {
            id: 2,
            name: '王五',
            position: '产品经理',
            company: '互联网科技公司',
            avatar: 'WW',
            content: '张三不仅技术过硬，而且非常善于沟通。他总能准确理解需求并提出建设性的意见，是我们团队的重要成员。',
            rating: 5
        },
        {
            id: 3,
            name: '赵六',
            position: '前端架构师',
            company: '软件开发工作室',
            avatar: 'ZL',
            content: '张三在前端技术方面有深厚的积累，特别是在性能优化和架构设计方面。与他共事期间，我从他那里学到了很多。',
            rating: 5
        }
    ],

    // 证书荣誉
    certificates: [
        {
            id: 1,
            name: 'AWS 解决方案架构师认证',
            issuer: 'Amazon Web Services',
            date: '2024',
            url: 'https://aws.amazon.com/certification/'
        },
        {
            id: 2,
            name: 'Google 云架构师认证',
            issuer: 'Google Cloud',
            date: '2023',
            url: 'https://cloud.google.com/certification'
        },
        {
            id: 3,
            name: 'PMP 项目管理专业人士认证',
            issuer: 'PMI',
            date: '2023',
            url: 'https://www.pmi.org/certifications'
        }
    ],

    // 开源贡献
    contributions: [
        {
            id: 1,
            name: 'React',
            description: '向 React 官方仓库提交了多个 bug 修复和文档改进',
            url: 'https://github.com/facebook/react',
            type: 'Bug Fix'
        },
        {
            id: 2,
            name: 'VS Code',
            description: '为 VS Code 贡献了一个主题插件，获得 1000+ 下载',
            url: 'https://github.com/zhangsan/vscode-theme',
            type: 'Plugin'
        },
        {
            id: 3,
            name: 'Open Source',
            description: '在 GitHub 上维护 5+ 个开源项目，累计获得 1000+ stars',
            url: 'https://github.com/zhangsan',
            type: 'Project'
        }
    ],

    // 语言能力
    languages: [
        { name: '中文', level: '母语', score: 100 },
        { name: '英语', level: '流利', score: 90 },
        { name: '日语', level: '初级', score: 30 }
    ],

    // 兴趣爱好
    interests: [
        '开源贡献',
        '技术写作',
        '摄影',
        '旅行',
        '阅读',
        '音乐'
    ]
};

// 数据辅助函数
const DataHelper = {
    // 获取所有项目
    getAllProjects() {
        return RESUME_DATA.projects;
    },

    // 获取精选项目
    getFeaturedProjects() {
        return RESUME_DATA.projects.filter(p => p.featured);
    },

    // 根据 ID 获取项目
    getProjectById(id) {
        return RESUME_DATA.projects.find(p => p.id === id);
    },

    // 获取指定分类的技能
    getSkillsByCategory(category) {
        return RESUME_DATA.skills[category] || [];
    },

    // 获取所有技能分类
    getAllSkillCategories() {
        return Object.keys(RESUME_DATA.skills);
    },

    // 获取最新博客文章
    getRecentBlogPosts(count = 3) {
        return RESUME_DATA.blog.slice(0, count);
    },

    // 根据 ID 获取博客文章
    getBlogPostById(id) {
        return RESUME_DATA.blog.find(p => p.id === id);
    },

    // 搜索博客文章
    searchBlogPosts(keyword) {
        return RESUME_DATA.blog.filter(post =>
            post.title.includes(keyword) || post.excerpt.includes(keyword)
        );
    },

    // 获取工作经历
    getExperience() {
        return RESUME_DATA.experience;
    },

    // 获取教育背景
    getEducation() {
        return RESUME_DATA.education;
    },

    // 获取推荐语
    getTestimonials() {
        return RESUME_DATA.testimonials;
    },

    // 获取证书
    getCertificates() {
        return RESUME_DATA.certificates;
    },

    // 获取开源贡献
    getContributions() {
        return RESUME_DATA.contributions;
    },

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    },

    // 计算工作年限
    calculateYearsOfExperience() {
        const firstJob = RESUME_DATA.experience[RESUME_DATA.experience.length - 1];
        const startYear = parseInt(firstJob.period.split(' - ')[0]);
        const currentYear = new Date().getFullYear();
        return currentYear - startYear;
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RESUME_DATA,
        DataHelper
    };
}
