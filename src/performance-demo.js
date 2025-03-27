/**
 * 性能优化效果演示
 * 用于展示项目中实现的各种性能优化技术的效果
 */

// 记录性能统计数据
class PerformanceStats {
    /**
     * 构造函数
     */
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            imageLoadTime: 0,
            resourceCount: 0,
            resourceSize: 0,
            cacheHits: 0
        };
        this.resourcesTracked = new Set();
        this.imageTiming = {};
        this.startTime = performance.now();
    }
    
    /**
     * 初始化性能监控
     */
    init() {
        this.startTime = performance.now();
        
        // 监听页面加载完成事件
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now() - this.startTime;
            this.logPerformance('页面加载完成');
        });
        
        // 监听资源加载
        this.observeResourceTiming();
        
        // 监控首次内容绘制
        this.observePaintTiming();
        
        // 添加图片加载监听
        this.observeImageLoading();
    }
    
    /**
     * 观察资源加载时间
     */
    observeResourceTiming() {
        // 创建性能观察器来监控资源加载
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                // 只处理尚未跟踪的资源
                if (!this.resourcesTracked.has(entry.name)) {
                    this.resourcesTracked.add(entry.name);
                    
                    // 增加资源计数
                    this.metrics.resourceCount++;
                    
                    // 估算资源大小（如果有）
                    if (entry.transferSize) {
                        this.metrics.resourceSize += entry.transferSize;
                    }
                    
                    // 检查是否从缓存加载
                    if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
                        this.metrics.cacheHits++;
                    }
                    
                    // 如果是图片资源，记录完成时间
                    if (entry.initiatorType === 'img') {
                        this.recordImageLoad(entry.name, entry.responseEnd);
                    }
                }
            });
        });
        
        // 开始观察资源加载
        resourceObserver.observe({ entryTypes: ['resource'] });
    }
    
    /**
     * 观察绘制时间
     */
    observePaintTiming() {
        // 创建性能观察器来监控绘制时间
        const paintObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                    this.logPerformance('首次内容绘制');
                }
            });
        });
        
        // 开始观察绘制时间
        paintObserver.observe({ entryTypes: ['paint'] });
    }
    
    /**
     * 观察图片加载
     */
    observeImageLoading() {
        // 监听DOM中添加的图片
        const imageObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG') {
                        this.trackImage(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(img => this.trackImage(img));
                    }
                });
            });
        });
        
        // 观察DOM变化
        imageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 跟踪当前页面中的所有图片
        document.querySelectorAll('img').forEach(img => this.trackImage(img));
    }
    
    /**
     * 跟踪单个图片的加载
     * @param {HTMLImageElement} img 图片元素
     */
    trackImage(img) {
        const src = img.src || img.dataset.src;
        if (!src || this.imageTiming[src]) return;
        
        // 记录开始加载时间
        this.imageTiming[src] = {
            start: performance.now(),
            end: 0
        };
        
        // 监听加载完成事件
        img.addEventListener('load', () => {
            if (this.imageTiming[src]) {
                this.imageTiming[src].end = performance.now();
                this.calculateImageLoadTime();
            }
        });
    }
    
    /**
     * 记录图片加载完成
     * @param {string} src 图片URL
     * @param {number} endTime 加载结束时间
     */
    recordImageLoad(src, endTime) {
        if (!this.imageTiming[src]) {
            this.imageTiming[src] = {
                start: this.startTime,
                end: endTime
            };
            this.calculateImageLoadTime();
        }
    }
    
    /**
     * 计算图片平均加载时间
     */
    calculateImageLoadTime() {
        let totalTime = 0;
        let count = 0;
        
        for (const src in this.imageTiming) {
            const timing = this.imageTiming[src];
            if (timing.end > 0) {
                totalTime += (timing.end - timing.start);
                count++;
            }
        }
        
        if (count > 0) {
            this.metrics.imageLoadTime = totalTime / count;
        }
    }
    
    /**
     * 记录性能数据
     * @param {string} event 事件名称
     */
    logPerformance(event) {
        console.log(`性能统计 - ${event}:`, {
            页面加载时间: `${this.metrics.pageLoadTime.toFixed(0)}ms`,
            首次内容绘制: `${this.metrics.firstContentfulPaint.toFixed(0)}ms`,
            图片平均加载时间: `${this.metrics.imageLoadTime.toFixed(0)}ms`,
            资源数量: this.metrics.resourceCount,
            资源总大小: `${(this.metrics.resourceSize / 1024 / 1024).toFixed(2)}MB`,
            缓存命中率: `${this.metrics.cacheHits ? ((this.metrics.cacheHits / this.metrics.resourceCount) * 100).toFixed(1) : 0}%`
        });
    }
    
    /**
     * 获取性能统计数据
     * @returns {Object} 性能统计数据
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * 显示性能统计面板
     */
    showStatsPanel() {
        // 创建统计面板元素
        const panel = document.createElement('div');
        panel.className = 'performance-stats-panel';
        panel.style = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
        `;
        
        // 添加面板内容
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">性能统计</div>
            <div class="stats-content"></div>
        `;
        
        // 添加到文档
        document.body.appendChild(panel);
        
        // 定期更新统计信息
        setInterval(() => {
            const contentEl = panel.querySelector('.stats-content');
            contentEl.innerHTML = `
                <div>页面加载时间: ${this.metrics.pageLoadTime.toFixed(0)}ms</div>
                <div>首次内容绘制: ${this.metrics.firstContentfulPaint.toFixed(0)}ms</div>
                <div>图片平均加载时间: ${this.metrics.imageLoadTime.toFixed(0)}ms</div>
                <div>资源数量: ${this.metrics.resourceCount}</div>
                <div>资源总大小: ${(this.metrics.resourceSize / 1024 / 1024).toFixed(2)}MB</div>
                <div>缓存命中率: ${this.metrics.cacheHits ? ((this.metrics.cacheHits / this.metrics.resourceCount) * 100).toFixed(1) : 0}%</div>
            `;
        }, 1000);
    }
}

// 懒加载演示
class LazyLoadDemo {
    /**
     * 构造函数
     */
    constructor(imageOptimizer) {
        this.imageOptimizer = imageOptimizer;
        this.demoSection = null;
    }
    
    /**
     * 创建演示区域
     */
    createDemoSection() {
        // 创建演示区域容器
        this.demoSection = document.createElement('section');
        this.demoSection.className = 'lazy-load-demo';
        this.demoSection.style = `
            padding: 40px 20px;
            background-color: #f8f9fa;
            margin: 30px 0;
        `;
        
        // 添加标题
        const title = document.createElement('h2');
        title.textContent = '懒加载演示';
        title.style = `
            text-align: center;
            margin-bottom: 20px;
        `;
        this.demoSection.appendChild(title);
        
        // 添加说明文字
        const description = document.createElement('p');
        description.textContent = '向下滚动查看图片如何在进入视口时才加载，这可以显著提高页面加载速度和减少带宽使用。';
        description.style = `
            text-align: center;
            max-width: 800px;
            margin: 0 auto 30px;
        `;
        this.demoSection.appendChild(description);
        
        // 创建图片网格
        const grid = document.createElement('div');
        grid.style = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        `;
        
        // 添加多个演示图片
        const imageCount = 20;
        for (let i = 1; i <= imageCount; i++) {
            const card = document.createElement('div');
            card.style = `
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
            
            // 生成唯一的图片URL
            const imageUrl = `https://picsum.photos/id/${i + 100}/400/300`;
            
            // 创建图片元素
            const img = document.createElement('img');
            img.dataset.src = imageUrl; // 使用data-src属性而不是src，以便懒加载
            img.className = 'lazy'; // 添加lazy类以便懒加载识别
            img.alt = `演示图片 ${i}`;
            img.style = `
                width: 100%;
                aspect-ratio: 4/3;
                object-fit: cover;
                display: block;
            `;
            
            // 创建图片说明
            const caption = document.createElement('div');
            caption.textContent = `懒加载图片 #${i}`;
            caption.style = `
                padding: 10px;
                text-align: center;
                font-size: 14px;
            `;
            
            // 将图片和说明添加到卡片
            card.appendChild(img);
            card.appendChild(caption);
            
            // 将卡片添加到网格
            grid.appendChild(card);
        }
        
        // 将网格添加到演示区域
        this.demoSection.appendChild(grid);
        
        // 返回创建的演示区域
        return this.demoSection;
    }
    
    /**
     * 初始化懒加载演示
     */
    initDemo() {
        // 创建演示区域
        const demoSection = this.createDemoSection();
        
        // 找到合适的位置添加到页面
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(demoSection);
            
            // 初始化或刷新懒加载
            if (this.imageOptimizer) {
                this.imageOptimizer.refresh();
            }
        }
    }
}

// 预加载演示
class PreloadDemo {
    /**
     * 构造函数
     */
    constructor(resourceLoader) {
        this.resourceLoader = resourceLoader;
        this.demoSection = null;
    }
    
    /**
     * 创建演示区域
     */
    createDemoSection() {
        // 创建演示区域容器
        this.demoSection = document.createElement('section');
        this.demoSection.className = 'preload-demo';
        this.demoSection.style = `
            padding: 40px 20px;
            background-color: #e9ecef;
            margin: 30px 0;
        `;
        
        // 添加标题
        const title = document.createElement('h2');
        title.textContent = '预加载演示';
        title.style = `
            text-align: center;
            margin-bottom: 20px;
        `;
        this.demoSection.appendChild(title);
        
        // 添加说明文字
        const description = document.createElement('p');
        description.textContent = '点击下方的游戏链接，感受预加载带来的瞬时响应体验。资源已提前加载，无需等待。';
        description.style = `
            text-align: center;
            max-width: 800px;
            margin: 0 auto 30px;
        `;
        this.demoSection.appendChild(description);
        
        // 创建预加载游戏链接区域
        const linksContainer = document.createElement('div');
        linksContainer.style = `
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            max-width: 800px;
            margin: 0 auto;
        `;
        
        // 添加多个游戏链接
        const games = [
            { id: 'snake', title: '贪吃蛇' },
            { id: 'spaceshooter', title: '太空射击' },
            { id: '2048', title: '2048' },
            { id: 'tetris', title: '俄罗斯方块' },
            { id: 'flappybird', title: '像素鸟' }
        ];
        
        games.forEach(game => {
            const link = document.createElement('a');
            link.href = `game.html?id=${game.id}`;
            link.textContent = game.title;
            link.style = `
                display: inline-block;
                padding: 12px 24px;
                background-color: #4a69bd;
                color: white;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                transition: all 0.2s ease;
            `;
            
            // 添加悬停效果
            link.onmouseover = () => {
                link.style.transform = 'translateY(-3px)';
                link.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                
                // 预加载游戏资源
                if (this.resourceLoader) {
                    this.resourceLoader.load(`/public/games/${game.id}.html`, {
                        priority: 0
                    });
                }
            };
            
            link.onmouseout = () => {
                link.style.transform = '';
                link.style.boxShadow = '';
            };
            
            linksContainer.appendChild(link);
        });
        
        // 将链接区域添加到演示区域
        this.demoSection.appendChild(linksContainer);
        
        // 添加预加载状态显示区域
        const statusContainer = document.createElement('div');
        statusContainer.id = 'preload-status';
        statusContainer.style = `
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        `;
        
        statusContainer.innerHTML = `
            <p style="margin: 0 0 10px 0; font-weight: bold;">预加载状态:</p>
            <div id="preload-progress" style="font-family: monospace; font-size: 14px;">
                未开始预加载
            </div>
        `;
        
        this.demoSection.appendChild(statusContainer);
        
        // 返回创建的演示区域
        return this.demoSection;
    }
    
    /**
     * 初始化预加载演示
     */
    initDemo() {
        // 创建演示区域
        const demoSection = this.createDemoSection();
        
        // 找到合适的位置添加到页面
        const main = document.querySelector('main');
        if (main) {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                main.insertBefore(demoSection, aboutSection);
            } else {
                main.appendChild(demoSection);
            }
            
            // 定期更新预加载状态
            if (this.resourceLoader) {
                setInterval(() => {
                    const stats = this.resourceLoader.getStats();
                    const progressEl = document.getElementById('preload-progress');
                    if (progressEl) {
                        progressEl.innerHTML = `
                            <div>总资源: ${stats.total}</div>
                            <div>成功加载: ${stats.success}</div>
                            <div>缓存命中: ${stats.cached}</div>
                            <div>加载失败: ${stats.failed}</div>
                            <div>当前加载中: ${this.resourceLoader.loading}</div>
                        `;
                    }
                }, 500);
            }
        }
    }
}

// 导出演示类
export { PerformanceStats, LazyLoadDemo, PreloadDemo }; 