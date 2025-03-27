/**
 * 游戏加载器
 * 负责加载和管理游戏iframe
 */
class GameLoader {
    /**
     * 构造函数
     * @param {HTMLElement} container 游戏容器元素
     */
    constructor(container) {
        this.container = container;
        this.gameFrame = null;
        this.loadingIndicator = null;
        this.isFullscreen = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.loadTimeout = null;
        this.currentGameId = null;
        
        // 回调函数
        this.onGameLoad = null;
        this.onGameError = null;
        this.onGameStop = null;
        
        // 创建加载指示器
        this.createLoadingIndicator();
        
        // 游戏数据映射
        this.gamesData = {
            'snake': {
                url: 'games/snake.html',
                title: '贪吃蛇'
            },
            'spaceshooter': {
                url: 'games/spaceshooter.html',
                title: '太空射击'
            },
            'tetris': {
                url: 'games/tetris.html',
                title: '俄罗斯方块',
                description: '经典的俄罗斯方块游戏，使用方向键控制方块的移动和旋转。',
                tags: ['益智', '休闲', '经典'],
                thumbnail: 'images/games/tetris.jpg'
            },
            'tower-defense': {
                url: 'games/tower-defense.html',
                title: '塔防游戏',
                description: '防御塔游戏，建造防御塔阻止敌人侵入您的基地。',
                tags: ['策略', '防御', '塔防'],
                thumbnail: 'images/games/tower-defense.jpg'
            },
            'minesweeper': {
                url: 'games/minesweeper.html',
                title: '扫雷',
                description: '经典的扫雷游戏，点击格子揭示数字，避开所有地雷。',
                tags: ['益智', '休闲', '经典'],
                thumbnail: 'images/games/minesweeper.jpg'
            },
            '2048': {
                url: 'games/2048.html',
                title: '2048',
                description: '2048是一款数字合成游戏，通过合并相同数字来得到2048。',
                tags: ['益智', '数字', '策略'],
                thumbnail: 'images/games/2048.jpg'
            },
            'flappy-bird': {
                url: 'games/flappy-bird.html',
                title: '像素鸟',
                description: '控制小鸟穿过障碍物，看看你能飞多远！',
                tags: ['休闲', '技巧', '挑战'],
                thumbnail: 'images/games/flappy-bird.jpg'
            },
            'breakout': {
                url: 'games/breakout.html',
                title: '打砖块',
                description: '使用挡板反弹球来打碎所有砖块的经典游戏。',
                tags: ['休闲', '经典', '街机'],
                thumbnail: 'images/games/breakout.jpg'
            },
            'chess': {
                url: 'games/chess.html',
                title: '国际象棋',
                description: '经典的双人国际象棋，与电脑或朋友对战。',
                tags: ['策略', '棋盘', '双人'],
                thumbnail: 'images/games/chess.jpg'
            },
            'xiangqi': {
                url: 'games/xiangqi.html',
                title: '中国象棋',
                description: '传统的中国象棋游戏，支持双人对战和人机对战。',
                tags: ['策略', '棋盘', '双人'],
                thumbnail: 'images/games/xiangqi.jpg'
            }
        };
    }
    
    /**
     * 创建加载指示器
     */
    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'game-loading';
        this.loadingIndicator.innerHTML = '<div class="spinner"></div>';
        this.loadingIndicator.style.display = 'none';
    }
    
    /**
     * 显示加载指示器
     */
    showLoading() {
        if (this.loadingIndicator && this.container) {
            if (!this.container.contains(this.loadingIndicator)) {
                this.container.appendChild(this.loadingIndicator);
            }
            this.loadingIndicator.style.display = 'flex';
        }
    }
    
    /**
     * 隐藏加载指示器
     */
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }
    
    /**
     * 加载游戏
     * @param {string} gameId 游戏ID
     * @param {Object} options 加载选项
     */
    loadGame(gameId, options = {}) {
        // 清除之前的加载超时
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
        
        // 存储当前游戏ID
        this.currentGameId = gameId;
        this.retryCount = 0;
        
        // 显示加载指示器
        this.showLoading();
        
        // 获取游戏数据
        const gameData = options.url ? { url: options.url } : this.fetchGameData(gameId);
        
        if (!gameData || !gameData.url) {
            this.handleError(new Error(`游戏数据不存在: ${gameId}`));
            return;
        }
        
        // 如果已有游戏框架，则移除
        if (this.gameFrame) {
            this.container.removeChild(this.gameFrame);
            this.gameFrame = null;
        }
        
        // 创建游戏框架
        this.createGameFrame(gameData.url);
        
        // 设置加载超时
        this.loadTimeout = setTimeout(() => {
            if (this.retryCount < this.maxRetries) {
                console.warn(`游戏加载超时，正在重试 (${this.retryCount + 1}/${this.maxRetries})`);
                this.retryCount++;
                this.loadGame(gameId, options);
            } else {
                this.handleError(new Error('游戏加载超时'));
            }
        }, 20000); // 20秒超时
    }
    
    /**
     * 获取游戏数据
     * @param {string} gameId 游戏ID
     * @returns {Object|null} 游戏数据
     */
    fetchGameData(gameId) {
        return this.gamesData[gameId] || null;
    }
    
    /**
     * 创建游戏框架
     * @param {string} url 游戏URL
     */
    createGameFrame(url) {
        // 创建iframe
        this.gameFrame = document.createElement('iframe');
        this.gameFrame.className = 'game-frame';
        this.gameFrame.src = url;
        this.gameFrame.setAttribute('allow', 'autoplay; fullscreen');
        this.gameFrame.setAttribute('loading', 'eager');
        
        // 添加事件监听器
        this.gameFrame.addEventListener('load', this.handleFrameLoad.bind(this));
        this.gameFrame.addEventListener('error', this.handleFrameError.bind(this));
        
        // 添加到容器
        this.container.appendChild(this.gameFrame);
    }
    
    /**
     * 处理框架加载完成
     */
    handleFrameLoad() {
        // 清除加载超时
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
        
        // 隐藏加载指示器
        this.hideLoading();
        
        // 调用加载完成回调
        if (typeof this.onGameLoad === 'function') {
            this.onGameLoad();
        }
    }
    
    /**
     * 处理框架加载错误
     * @param {Event} event 错误事件
     */
    handleFrameError(event) {
        // 尝试重新加载
        if (this.retryCount < this.maxRetries) {
            console.warn(`游戏加载失败，正在重试 (${this.retryCount + 1}/${this.maxRetries})`);
            this.retryCount++;
            
            // 移除当前框架
            this.container.removeChild(this.gameFrame);
            this.gameFrame = null;
            
            // 延迟重新加载
            setTimeout(() => {
                this.createGameFrame(event.target.src);
            }, 1000);
        } else {
            this.handleError(new Error('游戏加载失败'));
        }
    }
    
    /**
     * 处理错误
     * @param {Error} error 错误对象
     */
    handleError(error) {
        // 清除加载超时
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
        
        // 修改加载指示器显示错误信息
        if (this.loadingIndicator) {
            this.loadingIndicator.innerHTML = `
                <div style="text-align: center;">
                    <div style="margin-bottom: 10px; color: #ff6b6b;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
                    </div>
                    <div>${error.message}</div>
                    <button class="game-btn primary" style="margin-top: 15px;" id="retry-btn">
                        重试
                    </button>
                </div>
            `;
            
            // 添加重试按钮监听器
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => {
                        this.retryCount = 0;
                        this.loadGame(this.currentGameId);
                    });
                }
            }, 0);
        }
        
        // 调用错误回调
        if (typeof this.onGameError === 'function') {
            this.onGameError(error);
        }
    }
    
    /**
     * 停止游戏
     */
    stopGame() {
        // 清除加载超时
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
            this.loadTimeout = null;
        }
        
        // 移除游戏框架
        if (this.gameFrame && this.container.contains(this.gameFrame)) {
            this.container.removeChild(this.gameFrame);
            this.gameFrame = null;
        }
        
        // 隐藏加载指示器
        this.hideLoading();
        
        // 调用停止回调
        if (typeof this.onGameStop === 'function') {
            this.onGameStop();
        }
    }
    
    /**
     * 切换全屏模式
     */
    toggleFullscreen() {
        if (!this.gameFrame) return;
        
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    /**
     * 进入全屏模式
     */
    enterFullscreen() {
        if (!this.gameFrame) return;
        
        if (this.gameFrame.requestFullscreen) {
            this.gameFrame.requestFullscreen();
        } else if (this.gameFrame.mozRequestFullScreen) {
            this.gameFrame.mozRequestFullScreen();
        } else if (this.gameFrame.webkitRequestFullscreen) {
            this.gameFrame.webkitRequestFullscreen();
        } else if (this.gameFrame.msRequestFullscreen) {
            this.gameFrame.msRequestFullscreen();
        }
        
        this.isFullscreen = true;
    }
    
    /**
     * 退出全屏模式
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        this.isFullscreen = false;
    }
}

// 确保在非ES模块环境中也能正常工作
try {
    // 如果是ES模块环境
    export default GameLoader;
} catch (e) {
    // 如果是非ES模块环境
    // 什么都不做，GameLoader类在全局作用域中已可用
} 