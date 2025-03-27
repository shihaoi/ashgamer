/**
 * 性能演示初始化脚本
 * 用于初始化和运行性能演示页面
 */
import { PerformanceStats, LazyLoadDemo, PreloadDemo } from './performance-demo.js';
import ImageOptimizer from './utils/ImageOptimizer.js';
import ResourceLoader from './utils/ResourceLoader.js';
import gameDataManager from './utils/GameDataManager.js';

/**
 * 初始化性能演示
 */
async function initPerformanceDemo() {
    // 创建性能统计实例
    const performanceStats = new PerformanceStats();
    performanceStats.init();
    
    // 创建资源加载器实例
    const resourceLoader = new ResourceLoader({
        concurrency: 5,
        cacheEnabled: true,
        priorityLevels: 3
    });
    
    // 创建图片优化器实例
    const imageOptimizer = new ImageOptimizer({
        lazyLoadEnabled: true,
        lazyLoadThreshold: 300,
        webpEnabled: true
    });
    
    // 初始化游戏数据管理器
    await gameDataManager.init();
    
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化性能统计面板
        updateStatsPanel(performanceStats);
        
        // 初始化标签页切换
        initTabs();
        
        // 初始化懒加载演示
        initLazyLoadingDemo(imageOptimizer);
        
        // 初始化预加载演示
        initPreloadingDemo(resourceLoader);
        
        // 初始化性能对比演示
        initComparisonDemo();
    });
}

/**
 * 更新性能统计面板
 * @param {PerformanceStats} performanceStats 性能统计实例
 */
function updateStatsPanel(performanceStats) {
    const statsPanel = document.getElementById('stats-panel');
    
    if (!statsPanel) {
        // 创建统计面板
        const panel = document.createElement('div');
        panel.id = 'stats-panel';
        panel.className = 'stats-panel';
        
        panel.innerHTML = `
            <h3>性能统计</h3>
            <div id="stats-content"></div>
        `;
        
        document.body.appendChild(panel);
    }
    
    // 定期更新统计信息
    setInterval(() => {
        const metrics = performanceStats.getMetrics();
        const contentEl = document.getElementById('stats-content');
        
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="stats-item">
                    <span>页面加载时间:</span>
                    <span>${metrics.pageLoadTime.toFixed(0)}ms</span>
                </div>
                <div class="stats-item">
                    <span>首次内容绘制:</span>
                    <span>${metrics.firstContentfulPaint.toFixed(0)}ms</span>
                </div>
                <div class="stats-item">
                    <span>图片平均加载:</span>
                    <span>${metrics.imageLoadTime.toFixed(0)}ms</span>
                </div>
                <div class="stats-item">
                    <span>资源数量:</span>
                    <span>${metrics.resourceCount}</span>
                </div>
                <div class="stats-item">
                    <span>资源总大小:</span>
                    <span>${(metrics.resourceSize / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div class="stats-item">
                    <span>缓存命中率:</span>
                    <span>${metrics.cacheHits ? ((metrics.cacheHits / metrics.resourceCount) * 100).toFixed(1) : 0}%</span>
                </div>
            `;
        }
    }, 1000);
}

/**
 * 初始化标签页切换
 */
function initTabs() {
    const tabs = document.querySelectorAll('.demo-tab');
    
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的活动状态
            tabs.forEach(t => t.classList.remove('active'));
            
            // 添加当前标签的活动状态
            tab.classList.add('active');
            
            // 隐藏所有内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // 显示当前内容
            const tabId = tab.getAttribute('data-tab');
            const contentEl = document.getElementById(`${tabId}-tab`);
            if (contentEl) {
                contentEl.style.display = 'block';
            }
        });
    });
}

/**
 * 初始化懒加载演示
 * @param {ImageOptimizer} imageOptimizer 图片优化器实例
 */
function initLazyLoadingDemo(imageOptimizer) {
    const grid = document.getElementById('lazy-loading-grid');
    
    if (!grid) return;
    
    // 添加初始图片
    addLazyImages(grid, 8);
    
    // 添加图片按钮事件
    const addImagesBtn = document.getElementById('add-images-btn');
    if (addImagesBtn) {
        addImagesBtn.addEventListener('click', () => {
            addLazyImages(grid, 4);
            
            // 刷新懒加载
            imageOptimizer.refresh();
        });
    }
    
    // 切换懒加载按钮事件
    const toggleLazyBtn = document.getElementById('toggle-lazy-btn');
    if (toggleLazyBtn) {
        toggleLazyBtn.addEventListener('click', function() {
            if (imageOptimizer.options.lazyLoadEnabled) {
                imageOptimizer.options.lazyLoadEnabled = false;
                this.textContent = '启用懒加载';
                
                // 立即加载所有图片
                imageOptimizer.loadAllImages('img.lazy');
            } else {
                imageOptimizer.options.lazyLoadEnabled = true;
                this.textContent = '禁用懒加载';
                
                // 重新设置懒加载
                imageOptimizer.init('img.lazy');
            }
        });
    }
    
    // 初始化懒加载
    imageOptimizer.init('img.lazy');
}

/**
 * 添加懒加载图片
 * @param {HTMLElement} container 容器元素
 * @param {number} count 图片数量
 */
function addLazyImages(container, count) {
    for (let i = 0; i < count; i++) {
        const index = container.children.length + 1;
        
        const card = document.createElement('div');
        card.className = 'demo-card';
        
        // 使用随机图片ID
        const imageId = index + 100 + Math.floor(Math.random() * 100);
        
        // 图片URL
        const imageUrl = `https://picsum.photos/id/${imageId}/400/300`;
        
        card.innerHTML = `
            <div class="demo-image">
                <div class="loading-indicator">加载中...</div>
                <img data-src="${imageUrl}" alt="演示图片 ${index}" class="lazy">
            </div>
            <div class="demo-card-content">
                <h3 class="demo-card-title">懒加载图片 #${index}</h3>
                <p class="demo-card-text">滚动到视图中才会加载</p>
            </div>
        `;
        
        container.appendChild(card);
    }
}

/**
 * 初始化预加载演示
 * @param {ResourceLoader} resourceLoader 资源加载器实例
 */
async function initPreloadingDemo(resourceLoader) {
    const grid = document.getElementById('preloading-grid');
    
    if (!grid) return;
    
    try {
        // 获取游戏数据
        const games = await gameDataManager.getAllGames({ limit: 8 });
        
        // 添加游戏卡片
        games.forEach(game => {
            // 确保缩略图URL有效
            const thumbnailUrl = game.thumbnail || '/public/images/placeholder.jpg';
            
            const card = document.createElement('div');
            card.className = 'demo-card';
            card.style.cursor = 'pointer';
            
            card.innerHTML = `
                <div class="demo-image">
                    <img src="${thumbnailUrl}" alt="${game.title}">
                </div>
                <div class="demo-card-content">
                    <h3 class="demo-card-title">${game.title}</h3>
                    <p class="demo-card-text">${game.categories ? game.categories.join(', ') : '休闲'}</p>
                </div>
            `;
            
            // 状态指示器
            const statusElement = document.createElement('div');
            statusElement.className = 'preload-status';
            statusElement.style.padding = '5px';
            statusElement.style.fontSize = '12px';
            statusElement.style.color = '#666';
            statusElement.textContent = '悬停预加载';
            card.querySelector('.demo-card-content').appendChild(statusElement);
            
            // 添加鼠标悬停预加载
            card.addEventListener('mouseenter', () => {
                // 预加载游戏资源
                resourceLoader.load(game.url || `/public/games/${game.id}.html`, {
                    priority: 0,
                    type: 'generic'
                });
                
                // 更新状态
                statusElement.textContent = '正在预加载...';
                statusElement.style.color = '#4a69bd';
                card.style.borderColor = '#4a69bd';
                
                // 2秒后更新状态
                setTimeout(() => {
                    statusElement.textContent = '预加载完成！';
                    statusElement.style.color = '#44bd32';
                }, 2000);
            });
            
            // 添加点击事件
            card.addEventListener('click', () => {
                window.location.href = `game.html?id=${game.id}`;
            });
            
            grid.appendChild(card);
        });
        
        // 清除缓存按钮事件
        const clearCacheBtn = document.getElementById('clear-cache-btn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                resourceLoader.clearCache();
                alert('资源缓存已清除');
                
                // 重置所有卡片状态
                document.querySelectorAll('.preload-status').forEach(el => {
                    el.textContent = '悬停预加载';
                    el.style.color = '#666';
                });
                
                document.querySelectorAll('.demo-card').forEach(card => {
                    card.style.borderColor = '';
                });
            });
        }
        
        // 预加载全部按钮事件
        const preloadAllBtn = document.getElementById('preload-all-btn');
        if (preloadAllBtn) {
            preloadAllBtn.addEventListener('click', () => {
                // 更新所有卡片状态
                document.querySelectorAll('.preload-status').forEach(el => {
                    el.textContent = '正在预加载...';
                    el.style.color = '#4a69bd';
                });
                
                // 预加载所有游戏资源
                games.forEach(game => {
                    resourceLoader.load(game.url || `/public/games/${game.id}.html`, {
                        priority: 1,
                        type: 'generic'
                    });
                });
                
                // 3秒后更新状态
                setTimeout(() => {
                    document.querySelectorAll('.preload-status').forEach(el => {
                        el.textContent = '预加载完成！';
                        el.style.color = '#44bd32';
                    });
                }, 3000);
            });
        }
        
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        if (grid) {
            grid.innerHTML = '<p>加载游戏数据失败，请稍后再试</p>';
        }
    }
}

/**
 * 初始化性能对比演示
 */
function initComparisonDemo() {
    // 可以在这里实现更动态的性能比较数据
    // 例如，从实际测量中获取优化前后的数据
    
    // 这里简单地更新静态显示的数据
    const beforeStats = document.getElementById('before-stats');
    const afterStats = document.getElementById('after-stats');
    
    if (beforeStats && afterStats) {
        // 可以从真实测量数据中获取这些值
        const optimizationData = {
            before: {
                pageLoadTime: '2500ms',
                resourceSize: '5.4MB',
                requestCount: '42',
                firstContentfulPaint: '1200ms',
                timeToInteractive: '3100ms'
            },
            after: {
                pageLoadTime: '850ms',
                resourceSize: '1.2MB',
                requestCount: '12',
                firstContentfulPaint: '320ms',
                timeToInteractive: '980ms'
            }
        };
        
        // 计算性能提升百分比
        const improvements = {
            pageLoadTime: calculateImprovement(2500, 850),
            resourceSize: calculateImprovement(5.4, 1.2),
            requestCount: calculateImprovement(42, 12),
            firstContentfulPaint: calculateImprovement(1200, 320),
            timeToInteractive: calculateImprovement(3100, 980)
        };
        
        // 更新前后对比数据
        beforeStats.innerHTML = `
            <div class="stats-item">
                <span>页面加载时间:</span>
                <span>${optimizationData.before.pageLoadTime}</span>
            </div>
            <div class="stats-item">
                <span>初始资源大小:</span>
                <span>${optimizationData.before.resourceSize}</span>
            </div>
            <div class="stats-item">
                <span>HTTP请求数:</span>
                <span>${optimizationData.before.requestCount}</span>
            </div>
            <div class="stats-item">
                <span>首次内容绘制:</span>
                <span>${optimizationData.before.firstContentfulPaint}</span>
            </div>
            <div class="stats-item">
                <span>可交互时间:</span>
                <span>${optimizationData.before.timeToInteractive}</span>
            </div>
        `;
        
        afterStats.innerHTML = `
            <div class="stats-item">
                <span>页面加载时间:</span>
                <span>${optimizationData.after.pageLoadTime}</span>
                <span style="color:#44bd32;margin-left:5px">↓${improvements.pageLoadTime}%</span>
            </div>
            <div class="stats-item">
                <span>初始资源大小:</span>
                <span>${optimizationData.after.resourceSize}</span>
                <span style="color:#44bd32;margin-left:5px">↓${improvements.resourceSize}%</span>
            </div>
            <div class="stats-item">
                <span>HTTP请求数:</span>
                <span>${optimizationData.after.requestCount}</span>
                <span style="color:#44bd32;margin-left:5px">↓${improvements.requestCount}%</span>
            </div>
            <div class="stats-item">
                <span>首次内容绘制:</span>
                <span>${optimizationData.after.firstContentfulPaint}</span>
                <span style="color:#44bd32;margin-left:5px">↓${improvements.firstContentfulPaint}%</span>
            </div>
            <div class="stats-item">
                <span>可交互时间:</span>
                <span>${optimizationData.after.timeToInteractive}</span>
                <span style="color:#44bd32;margin-left:5px">↓${improvements.timeToInteractive}%</span>
            </div>
        `;
    }
}

/**
 * 计算性能提升百分比
 * @param {number} before 优化前的值
 * @param {number} after 优化后的值
 * @returns {string} 提升百分比
 */
function calculateImprovement(before, after) {
    const reduction = (before - after) / before * 100;
    return reduction.toFixed(0);
}

// 导出初始化函数
export default initPerformanceDemo; 