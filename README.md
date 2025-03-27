# CrazyGames 克隆项目

这是一个模仿 [CrazyGames](https://www.crazygames.com/) 的Web游戏平台项目。本项目仅用于学习和练习前端开发技能，不用于商业目的。

## 项目结构

```
hellogame/
├── public/           # 静态资源目录
│   ├── css/          # CSS样式文件
│   ├── js/           # JavaScript文件
│   └── images/       # 图片资源
├── src/              # 源代码目录
│   ├── components/   # 组件
│   └── utils/        # 工具类
├── index.html        # 主页HTML
└── README.md         # 项目说明
```

## 功能特性

- 响应式设计，支持各种设备
- 游戏分类浏览
- 游戏搜索功能
- 多语言支持
- 原创游戏、精选游戏和新游戏展示
- 本地和在线多人游戏支持

## 本地运行

1. 克隆项目到本地
   ```
   git clone https://github.com/yourusername/hellogame.git
   cd hellogame
   ```

2. 使用任意HTTP服务器运行项目，例如使用Python的SimpleHTTPServer:
   ```
   python -m http.server
   ```

   或者使用Node.js的http-server:
   ```
   npx http-server
   ```

3. 在浏览器中访问 `http://localhost:8000` 或对应端口

## 技术栈

- HTML5
- CSS3 (包括CSS变量、Flexbox和Grid布局)
- 原生JavaScript (ES6+)
- 响应式设计
- 本地存储 (localStorage)

## 未来计划

- 添加更多游戏资源
- 实现用户账户系统
- 添加游戏评分和评论功能
- 改进搜索算法
- 集成支付系统
- 开发更多原创游戏

## 许可证

MIT

## 免责声明

本项目仅用于学习和教育目的，与官方CrazyGames网站无关。所有游戏名称和图片仅作示例使用。 