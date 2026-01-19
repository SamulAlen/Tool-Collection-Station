# 工具集合站 🧰

一个集成了多种实用工具的在线工具箱，采用侧边栏导航设计，提供便捷的工具切换体验。

## 项目简介

工具集合站是一个将多个独立 Web 应用整合在一起的统一平台，用户可以通过简洁的侧边栏导航在不同工具之间快速切换，无需打开多个标签页。

## 包含的工具

### 💱 货币转换器
实时汇率转换工具，支持 30+ 种世界货币的相互转换。
- 实时汇率查询
- 货币收藏功能
- 转换历史记录
- 一键复制结果

### 🍅 番茄计时器
基于番茄工作法的专注计时工具，帮助提高工作效率。
- 25分钟工作/5分钟休息
- 自定义计时设置
- 任务管理功能
- 音效提醒
- 使用统计

### 🎮 单词消消乐
中英文单词配对游戏，寓教于乐的学习工具。
- 60秒限时挑战
- 丰富的词库
- 计分系统
- 音效反馈

### 🎆 烟花秀
绚丽多彩的烟花秀表演，释放压力的视觉盛宴。
- 6种烟花类型（觅虹甜心、超新星、全息光环、液态金芒、数码流呈、机械繁花）
- 可调节色调和氛围发射
- 手动/自动发射模式
- 精美的控制台界面

### 👤 关于
个人简历网站，展示开发者信息和技能。
- 个人简介
- 工作经历
- 技能展示
- 项目作品
- 联系方式

## 技术栈

### 前端框架
- **HTML5** - 语义化标签
- **CSS3** - 现代化样式，CSS Grid & Flexbox
- **JavaScript (ES6+)** - 模块化开发

### 核心技术
- **iframe** - 子应用隔离和加载
- **History API** - 路由管理
- **LocalStorage** - 数据持久化
- **Web Audio API** - 音效生成
- **Canvas** - 粒子动画效果

## 项目结构

```
工具集合站/
├── index.html              # 主入口文件
├── css/
│   ├── main.css           # 主样式文件
│   ├── sidebar.css        # 侧边栏样式
│   └── responsive.css     # 响应式样式
├── js/
│   ├── config.js          # 应用配置
│   ├── main.js            # 主入口逻辑
│   ├── navigation.js      # 导航控制器
│   └── iframe-controller.js # iframe管理器
└── apps/                  # 子应用目录
    ├── converter/         # 货币转换器
    ├── timer/             # 番茄计时器
    ├── game/              # 单词消消乐
    ├── fire/              # 烟花秀
    └── about/             # 个人简历
```

## 快速开始

### 安装
无需安装，直接在浏览器中打开 `index.html` 即可使用。

### 本地运行
1. 克隆或下载本项目
2. 用浏览器打开 `index.html`
3. 开始使用各种工具！

### 部署
可直接部署到任何静态网站托管服务：
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## 功能特点

### 统一导航
- 侧边栏导航，快速切换工具
- 当前工具高亮显示
- 响应式设计，移动端友好

### 独立运行
- 每个工具完全独立运行
- 使用 iframe 隔离，互不干扰
- 各自保持完整功能

### 路由管理
- 基于 Hash 的 URL 路由
- 支持浏览器前进/后退
- 可直接链接到特定工具

### 键盘快捷键
- `Alt + 1` - 货币转换器
- `Alt + 2` - 番茄计时器
- `Alt + 3` - 单词消消乐
- `Alt + 4` - 烟花秀
- `Alt + 5` - 关于
- `Alt + M` - 切换移动端菜单

## 响应式设计

支持多种设备尺寸：
- 🖥️ 桌面端 (>1024px) - 侧边栏固定显示
- 📱 移动端 (≤1024px) - 侧边栏隐藏，汉堡菜单

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## 开发

### 添加新工具
1. 在 `apps/` 目录下创建新的工具文件夹
2. 在 `js/config.js` 中添加配置：
```javascript
newTool: {
    id: 'newTool',
    name: '新工具',
    icon: '🔧',
    path: 'apps/newTool/index.html',
    description: '工具描述'
}
```
3. 在 `index.html` 的导航中添加链接

### 修改主题色
编辑 `css/main.css` 中的 CSS 变量：
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* 修改为你喜欢的颜色 */
}
```

## 配置说明

### 应用配置 (js/config.js)
```javascript
const APP_CONFIG = {
    apps: {
        // 子应用配置
    },
    defaultApp: 'converter',  // 默认显示的应用
    siteInfo: {
        title: '工具集合站',
        subtitle: '你的在线工具箱',
        version: '1.0.0'
    }
};
```

## 未来计划

- [ ] 添加更多实用工具
- [ ] 支持主题自定义
- [ ] 添加搜索功能
- [ ] 工具使用统计
- [ ] PWA 支持
- [ ] 多语言界面
- [ ] 用户数据同步

## 许可证

MIT License - 自由使用和修改

## 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 致谢

感谢所有开源项目的贡献者和使用者！

## 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: your.email@example.com

---

**版本**: 1.0.0
**最后更新**: 2025-01-16
**开发者**: Your Name

## Star History

如果这个项目对你有帮助，请给一个 ⭐️ Star！
