# 个人简历网站

一个创意个性化的高级软件开发工程师简历网站，采用现代Web设计趋势，包含丰富的动效和3D效果，完美响应式设计。

## 功能特点

### 视觉效果
- 粒子背景动画 - 动态粒子连接网络效果，支持鼠标交互
- 滚动触发动画 - 元素进入视口时触发淡入、滑入、缩放等动画
- 3D效果 - 卡片翻转、视差滚动、3D倾斜效果
- 打字机效果 - 英雄区标题打字机动画
- 数字计数动画 - 统计数字动态增长效果

### 内容模块
- 导航栏 - 固定顶部，支持平滑滚动和高亮当前区块
- 英雄区 - 全屏展示，渐变背景，浮动图形
- 个人简介 - 统计卡片展示
- 工作经历 - 时间轴样式，左右交替布局
- 技能展示 - 分类标签切换，进度条动画
- 项目作品 - 卡片展示，悬停效果
- 技术博客 - 文章列表展示
- 推荐语 - 客户/同事推荐展示
- 联系方式 - 信息卡片 + 联系表单

### 交互功能
- 平滑滚动导航
- 移动端汉堡菜单
- 返回顶部按钮
- 技能分类切换
- 表单验证和提交
- 社交链接

### 技术特性
- 完全响应式设计
- SEO优化（meta标签、Open Graph、结构化数据）
- 性能优化（懒加载、防抖节流）
- 无障碍访问（ARIA标签）
- 深色模式支持
- 打印样式优化

## 快速开始

### 本地运行

1. 克隆或下载项目
2. 直接在浏览器中打开 `index.html`

或使用本地服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:8000
```

3. 访问 `http://localhost:8000`

### 文件结构

```
个人简历网站/
├── index.html              # 主页面
├── README.md              # 项目说明
├── css/
│   ├── main.css          # 主样式
│   ├── animations.css    # 动画效果
│   ├── particles.css     # 粒子背景
│   ├── timeline.css      # 时间轴样式
│   └── responsive.css    # 响应式设计
├── js/
│   ├── config.js         # 全局配置
│   ├── data.js           # 简历数据
│   ├── particles.js      # 粒子系统
│   ├── animations.js     # 滚动动画
│   ├── navigation.js     # 导航控制
│   └── main.js           # 主入口
└── images/
    ├── avatar.jpg        # 个人头像
    ├── favicon.ico       # 网站图标
    └── logos/           # 技术栈logo
```

## 自定义内容

### 修改个人信息

编辑 `js/data.js` 文件中的 `RESUME_DATA` 对象：

```javascript
const RESUME_DATA = {
    profile: {
        name: '你的名字',
        title: '高级软件开发工程师',
        email: 'your.email@example.com',
        // ... 更多信息
    },
    experience: [
        // 工作经历
    ],
    skills: {
        frontend: [
            // 前端技能
        ],
        backend: [
            // 后端技能
        ]
    },
    projects: [
        // 项目作品
    ]
    // ... 更多数据
};
```

### 修改配色方案

编辑 `css/main.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #f5576c;
    --text-primary: #2d3436;
    --text-secondary: #636e72;
    /* ... 更多变量 */
}
```

### 调整动画效果

编辑 `js/config.js` 中的配置：

```javascript
const CONFIG = {
    particles: {
        enabled: true,
        count: {
            desktop: 100,
            tablet: 60,
            mobile: 30
        }
    },
    animations: {
        enabled: true,
        threshold: 0.1
    }
    // ... 更多配置
};
```

## 技术栈

- **HTML5** - 语义化标签、结构化数据
- **CSS3** - 变量、Flexbox、Grid、3D变换、关键帧动画
- **JavaScript (ES6+)** - 模块化、类、箭头函数、解构等现代特性
- **Canvas API** - 粒子背景效果
- **IntersectionObserver API** - 滚动动画触发
- **LocalStorage** - 本地数据持久化

## 浏览器支持

- Chrome/Edge (推荐) ✅
- Firefox ✅
- Safari ✅
- 移动端浏览器 ✅

## 性能优化

- 粒子系统根据设备性能自动调整数量
- 图片懒加载
- 滚动事件防抖节流
- CSS动画使用transform和opacity
- 移动端减少动画效果

## 响应式断点

- 手机: < 480px
- 手机横屏: 480px - 575px
- 平板竖屏: 576px - 767px
- 平板横屏: 768px - 991px
- 笔记本: 992px - 1399px
- 桌面: 1400px+

## 部署

### GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为源
4. 访问 `https://yourusername.github.io/repository-name`

### Netlify

1. 将项目推送到 Git 仓库
2. 在 Netlify 中导入项目
3. 自动部署完成

### Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在项目目录运行: `vercel`
3. 按提示完成部署

## 自定义域名

在 `js/config.js` 中更新配置：

```javascript
const CONFIG = {
    site: {
        name: '你的名字',
        url: 'https://yourdomain.com'
    }
};
```

更新 `index.html` 中的 meta 标签和结构化数据。

## 许可证

MIT License

## 贡献

欢迎提交问题和改进建议！

## 联系方式

如有问题，请通过以下方式联系：

- 邮箱: your.email@example.com
- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourusername

---

**注意**: 请记得在使用前替换所有占位符内容（个人信息、图片、链接等）。
