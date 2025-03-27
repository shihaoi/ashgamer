# HelloGame - 免费在线HTML5游戏平台

HelloGame是一个提供免费在线HTML5游戏的平台，包括动作、益智、策略等多种类型游戏。网站采用响应式设计，支持PC端和移动端访问。

## 项目结构

```
hellogame/
│
├── public/              # 静态资源
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript文件
│   ├── images/         # 图片资源
│   │   └── games/     # 游戏缩略图
│   └── games/          # 游戏文件
│
├── src/                 # 源代码
│   ├── api/            # API接口
│   ├── components/     # 组件
│   └── utils/          # 工具函数
│
├── index.html           # 主页
├── category.html        # 分类页
├── game.html            # 游戏详情页
└── README.md            # 项目说明
```

## 特色功能

- 多种游戏分类：动作、益智、策略、休闲等
- 响应式设计：完美支持PC和移动设备
- 多语言支持：支持中文和英文
- 游戏收藏功能：用户可以收藏喜欢的游戏
- 游戏搜索功能：快速找到想玩的游戏
- 游戏推荐系统：基于用户喜好推荐游戏
- 黑暗模式：提供更舒适的夜间游戏体验

## 部署注意事项

### 图片资源

项目需要以下图片资源，请在部署前准备：

1. Logo图片: `public/images/logo.png`
2. 首页背景图: `public/images/hero-image.jpg` 
3. 关于我们图片: `public/images/about-image.jpg`
4. 游戏缩略图(位于 `public/images/games/` 目录):
   - snake.jpg - 贪吃蛇游戏缩略图
   - spaceshooter.jpg - 太空射击游戏缩略图
   - tetris.jpg - 俄罗斯方块游戏缩略图
   - 2048.jpg - 2048游戏缩略图
   - flappybird.jpg - Flappy Bird游戏缩略图
   - breakout.jpg - 打砖块游戏缩略图
   - 其他游戏图片...

可以使用任何符合游戏主题的图片替代，建议尺寸为16:9比例，推荐分辨率为480x270像素。

### 路径引用

当使用GitHub Pages、Vercel或其他静态网站托管服务部署时，确保所有资源引用使用相对路径而非绝对路径。例如:

- 正确: `public/images/logo.png`
- 错误: `/public/images/logo.png` (以斜杠开头)

## 本地运行

1. 克隆项目到本地
```bash
git clone https://github.com/您的用户名/hellogame.git
cd hellogame
```

2. 使用本地服务器运行项目（任选一种）
```bash
# 使用Python自带的HTTP服务器
python -m http.server

# 或使用Node.js的http-server（需先安装）
npx http-server
```

3. 在浏览器中访问 `http://localhost:8000` 或 `http://localhost:8080`

## 使用GitHub Pages部署

您可以使用GitHub Pages免费部署这个项目：

1. 在GitHub上创建一个新仓库

2. 将项目推送到GitHub
```bash
git remote add origin https://github.com/您的用户名/hellogame.git
git push -u origin main
```

3. 在GitHub仓库设置中启用GitHub Pages
   - 进入仓库页面，点击"Settings"
   - 左侧菜单找到"Pages"
   - 在"Source"部分，选择"main"分支和"/(root)"文件夹
   - 点击"Save"按钮

4. 几分钟后，您的网站将在 `https://您的用户名.github.io/hellogame` 上线

## 技术栈

- HTML5 + CSS3 + JavaScript
- 响应式设计
- 本地存储API（localStorage）
- 现代CSS布局技术（Flexbox、Grid）

## 未来计划

- 添加更多游戏内容
- 实现用户登录和注册功能
- 添加游戏排行榜和成就系统
- 优化游戏加载速度
- 实现游戏数据云存储功能

## 许可证

本项目采用[MIT许可证](https://opensource.org/licenses/MIT)。

## 免责声明

本项目仅用于学习和教育目的，与商业游戏平台没有任何关联。所有游戏内容均为开源或自行开发，如有侵权，请联系我们删除。# ashgamer
