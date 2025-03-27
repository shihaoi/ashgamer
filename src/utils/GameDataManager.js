/**
 * 游戏数据管理工具
 * 用于统一管理游戏数据的获取、处理和缓存
 */
import { getAllGames, getGameById, getGamesByCategory, getRecommendedGames, getSimilarGames } from '../api/gamesApi.js';
import RecommendationEngine from './RecommendationEngine.js';

class GameDataManager {
    /**
     * 构造函数
     */
    constructor() {
        // 缓存
        this.cache = {
            allGames: null,
            gameById: {},
            gamesByCategory: {},
            recommendedGames: {},
            similarGames: {},
            lastFetch: 0
        };
        
        // 推荐引擎
        this.recommendationEngine = null;
        
        // 缓存有效期（毫秒）
        this.cacheLifetime = 5 * 60 * 1000; // 5分钟
        
        // 用户偏好
        this.userPreferences = this.loadUserPreferences();
    }
    
    /**
     * 初始化
     */
    async init() {
        try {
            // 获取所有游戏
            const games = await this.getAllGames();
            
            // 初始化推荐引擎
            this.recommendationEngine = new RecommendationEngine(games);
            this.recommendationEngine.loadUserHistory();
            
            return games;
        } catch (error) {
            console.error('初始化游戏数据管理器失败:', error);
            throw error;
        }
    }
    
    /**
     * 获取所有游戏
     * @param {Object} options 可选参数
     * @returns {Promise<Array>} 游戏数组
     */
    async getAllGames(options = {}) {
        // 检查缓存是否有效
        const now = Date.now();
        if (this.cache.allGames && (now - this.cache.lastFetch < this.cacheLifetime) && !options.forceRefresh) {
            // 应用过滤和排序
            return this.filterAndSortGames(this.cache.allGames, options);
        }
        
        try {
            // 从API获取数据
            const games = await getAllGames(options);
            
            // 更新缓存
            this.cache.allGames = [...games]; // 保存一个副本，避免引用问题
            this.cache.lastFetch = now;
            
            return games;
        } catch (error) {
            console.error('获取所有游戏失败:', error);
            
            // 如果有缓存但已过期，仍然可以使用
            if (this.cache.allGames) {
                return this.filterAndSortGames(this.cache.allGames, options);
            }
            
            throw error;
        }
    }
    
    /**
     * 获取单个游戏
     * @param {string} gameId 游戏ID
     * @param {boolean} forceRefresh 是否强制刷新
     * @returns {Promise<Object>} 游戏对象
     */
    async getGame(gameId, forceRefresh = false) {
        // 检查缓存
        if (this.cache.gameById[gameId] && !forceRefresh) {
            return this.cache.gameById[gameId];
        }
        
        try {
            // 从API获取数据
            const game = await getGameById(gameId);
            
            // 更新缓存
            this.cache.gameById[gameId] = { ...game };
            
            return game;
        } catch (error) {
            console.error(`获取游戏ID:${gameId}失败:`, error);
            throw error;
        }
    }
    
    /**
     * 获取特定类别的游戏
     * @param {string} category 类别
     * @param {Object} options 可选参数
     * @returns {Promise<Array>} 游戏数组
     */
    async getGamesByCategory(category, options = {}) {
        const cacheKey = `${category}-${JSON.stringify(options)}`;
        
        // 检查缓存
        if (this.cache.gamesByCategory[cacheKey] && !options.forceRefresh) {
            return this.cache.gamesByCategory[cacheKey];
        }
        
        try {
            // 从API获取数据
            const games = await getGamesByCategory(category, options);
            
            // 更新缓存
            this.cache.gamesByCategory[cacheKey] = [...games];
            
            return games;
        } catch (error) {
            console.error(`获取类别:${category}的游戏失败:`, error);
            throw error;
        }
    }
    
    /**
     * 获取推荐游戏
     * @param {string} type 推荐类型 ('featured', 'new')
     * @param {number} limit 限制数量
     * @param {boolean} forceRefresh 是否强制刷新
     * @returns {Promise<Array>} 游戏数组
     */
    async getRecommendedGames(type, limit = 5, forceRefresh = false) {
        const cacheKey = `${type}-${limit}`;
        
        // 检查缓存
        if (this.cache.recommendedGames[cacheKey] && !forceRefresh) {
            return this.cache.recommendedGames[cacheKey];
        }
        
        try {
            // 从API获取数据
            const games = await getRecommendedGames(type, limit);
            
            // 更新缓存
            this.cache.recommendedGames[cacheKey] = [...games];
            
            return games;
        } catch (error) {
            console.error(`获取${type}推荐游戏失败:`, error);
            throw error;
        }
    }
    
    /**
     * 获取相似游戏
     * @param {string} gameId 游戏ID
     * @param {number} limit 限制数量
     * @param {boolean} forceRefresh 是否强制刷新
     * @returns {Promise<Array>} 游戏数组
     */
    async getSimilarGames(gameId, limit = 4, forceRefresh = false) {
        const cacheKey = `${gameId}-${limit}`;
        
        // 检查缓存
        if (this.cache.similarGames[cacheKey] && !forceRefresh) {
            return this.cache.similarGames[cacheKey];
        }
        
        try {
            // 使用推荐引擎
            if (this.recommendationEngine) {
                const recommendedGames = this.recommendationEngine.getContentBasedRecommendations(gameId, limit);
                
                // 如果推荐引擎返回结果，使用它
                if (recommendedGames && recommendedGames.length > 0) {
                    this.cache.similarGames[cacheKey] = [...recommendedGames];
                    return recommendedGames;
                }
            }
            
            // 如果推荐引擎没有返回结果，使用API
            const games = await getSimilarGames(gameId, limit);
            
            // 更新缓存
            this.cache.similarGames[cacheKey] = [...games];
            
            return games;
        } catch (error) {
            console.error(`获取与${gameId}相似的游戏失败:`, error);
            throw error;
        }
    }
    
    /**
     * 获取个性化推荐
     * @param {number} limit 限制数量
     * @returns {Promise<Array>} 游戏数组
     */
    async getPersonalizedRecommendations(limit = 10) {
        if (!this.recommendationEngine) {
            await this.init();
        }
        
        try {
            // 获取混合推荐
            const recommendations = this.recommendationEngine.getHybridRecommendations(null, limit);
            
            // 如果没有足够的个性化推荐，补充热门游戏
            if (recommendations.length < limit) {
                const popularGames = await this.getAllGames({
                    sort: 'popular',
                    limit: limit - recommendations.length
                });
                
                // 合并并去重
                const recommendedIds = recommendations.map(game => game.id);
                const additionalGames = popularGames.filter(game => !recommendedIds.includes(game.id));
                
                return [...recommendations, ...additionalGames.slice(0, limit - recommendations.length)];
            }
            
            return recommendations;
        } catch (error) {
            console.error('获取个性化推荐失败:', error);
            
            // 回退到热门游戏
            return this.getAllGames({ sort: 'popular', limit });
        }
    }
    
    /**
     * 记录游戏浏览
     * @param {Object} game 游戏对象
     */
    recordGameView(game) {
        if (!game || !game.id) return;
        
        // 更新浏览历史
        const viewHistory = this.userPreferences.viewHistory || [];
        
        // 检查是否已存在
        const existingIndex = viewHistory.findIndex(item => item.gameId === game.id);
        if (existingIndex !== -1) {
            // 移除现有记录
            viewHistory.splice(existingIndex, 1);
        }
        
        // 添加到历史记录开头
        viewHistory.unshift({
            gameId: game.id,
            title: game.title,
            timestamp: Date.now()
        });
        
        // 限制历史记录长度
        const maxHistory = 20;
        if (viewHistory.length > maxHistory) {
            viewHistory.splice(maxHistory);
        }
        
        // 更新用户偏好
        this.userPreferences.viewHistory = viewHistory;
        this.saveUserPreferences();
        
        // 更新推荐引擎
        if (this.recommendationEngine) {
            this.recommendationEngine.addUserRecord({
                gameId: game.id,
                playTime: 0,
                rating: null
            });
        }
    }
    
    /**
     * 记录游戏播放
     * @param {Object} game 游戏对象
     * @param {number} playTime 游戏时间（秒）
     * @param {number} rating 评分（1-5）
     */
    recordGamePlay(game, playTime = 0, rating = null) {
        if (!game || !game.id) return;
        
        // 更新游戏历史
        const playHistory = this.userPreferences.playHistory || [];
        
        // 检查是否已存在
        const existingIndex = playHistory.findIndex(item => item.gameId === game.id);
        if (existingIndex !== -1) {
            // 更新现有记录
            playHistory[existingIndex] = {
                ...playHistory[existingIndex],
                playCount: (playHistory[existingIndex].playCount || 0) + 1,
                totalPlayTime: (playHistory[existingIndex].totalPlayTime || 0) + playTime,
                lastPlayed: Date.now()
            };
            
            // 如果提供了评分，更新评分
            if (rating !== null) {
                playHistory[existingIndex].rating = rating;
            }
        } else {
            // 添加新记录
            playHistory.push({
                gameId: game.id,
                title: game.title,
                playCount: 1,
                totalPlayTime: playTime,
                rating: rating,
                firstPlayed: Date.now(),
                lastPlayed: Date.now()
            });
        }
        
        // 更新用户偏好
        this.userPreferences.playHistory = playHistory;
        this.saveUserPreferences();
        
        // 更新推荐引擎
        if (this.recommendationEngine) {
            this.recommendationEngine.addUserRecord({
                gameId: game.id,
                playTime: playTime,
                rating: rating
            });
        }
    }
    
    /**
     * 添加或移除收藏
     * @param {Object} game 游戏对象
     * @returns {boolean} 是否已收藏
     */
    toggleFavorite(game) {
        if (!game || !game.id) return false;
        
        // 获取收藏列表
        const favorites = this.userPreferences.favorites || [];
        
        // 检查是否已收藏
        const existingIndex = favorites.findIndex(item => item.gameId === game.id);
        
        if (existingIndex !== -1) {
            // 移除收藏
            favorites.splice(existingIndex, 1);
            this.userPreferences.favorites = favorites;
            this.saveUserPreferences();
            return false;
        } else {
            // 添加收藏
            favorites.push({
                gameId: game.id,
                title: game.title,
                timestamp: Date.now()
            });
            this.userPreferences.favorites = favorites;
            this.saveUserPreferences();
            return true;
        }
    }
    
    /**
     * 检查游戏是否已收藏
     * @param {string} gameId 游戏ID
     * @returns {boolean} 是否已收藏
     */
    isFavorited(gameId) {
        if (!gameId) return false;
        
        const favorites = this.userPreferences.favorites || [];
        return favorites.some(item => item.gameId === gameId);
    }
    
    /**
     * 获取用户收藏的游戏
     * @returns {Array} 收藏的游戏ID数组
     */
    getFavorites() {
        return this.userPreferences.favorites || [];
    }
    
    /**
     * 获取用户最近浏览的游戏
     * @param {number} limit 限制数量
     * @returns {Array} 最近浏览的游戏
     */
    getRecentlyViewed(limit = 10) {
        const viewHistory = this.userPreferences.viewHistory || [];
        return viewHistory.slice(0, limit);
    }
    
    /**
     * 获取用户最近玩过的游戏
     * @param {number} limit 限制数量
     * @returns {Array} 最近玩过的游戏
     */
    getRecentlyPlayed(limit = 10) {
        const playHistory = this.userPreferences.playHistory || [];
        
        // 按最后游玩时间排序
        return playHistory
            .sort((a, b) => b.lastPlayed - a.lastPlayed)
            .slice(0, limit);
    }
    
    /**
     * 过滤和排序游戏
     * @param {Array} games 游戏数组
     * @param {Object} options 选项
     * @returns {Array} 过滤和排序后的游戏数组
     */
    filterAndSortGames(games, options = {}) {
        let result = [...games];
        
        // 过滤
        if (options.category) {
            result = result.filter(game => 
                game.categories && game.categories.includes(options.category)
            );
        }
        
        if (options.tag) {
            result = result.filter(game => 
                game.tags && game.tags.includes(options.tag)
            );
        }
        
        if (options.search) {
            const searchLower = options.search.toLowerCase();
            result = result.filter(game => 
                game.title.toLowerCase().includes(searchLower) || 
                (game.description && game.description.toLowerCase().includes(searchLower))
            );
        }
        
        // 排序
        if (options.sort) {
            switch(options.sort) {
                case 'popular':
                    result.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                    break;
                case 'rating':
                    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case 'newest':
                    result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                    break;
            }
        }
        
        // 分页
        if (options.limit && options.limit > 0) {
            const offset = options.offset || 0;
            result = result.slice(offset, offset + options.limit);
        }
        
        return result;
    }
    
    /**
     * 加载用户偏好
     * @returns {Object} 用户偏好
     */
    loadUserPreferences() {
        try {
            const prefsJson = localStorage.getItem('userGamePreferences');
            return prefsJson ? JSON.parse(prefsJson) : {
                favorites: [],
                viewHistory: [],
                playHistory: [],
                settings: {
                    theme: 'light',
                    language: 'zh'
                }
            };
        } catch (e) {
            console.error('加载用户偏好失败:', e);
            return {
                favorites: [],
                viewHistory: [],
                playHistory: [],
                settings: {
                    theme: 'light',
                    language: 'zh'
                }
            };
        }
    }
    
    /**
     * 保存用户偏好
     */
    saveUserPreferences() {
        try {
            localStorage.setItem('userGamePreferences', JSON.stringify(this.userPreferences));
        } catch (e) {
            console.error('保存用户偏好失败:', e);
        }
    }
    
    /**
     * 更新用户设置
     * @param {Object} settings 用户设置
     */
    updateSettings(settings) {
        this.userPreferences.settings = {
            ...this.userPreferences.settings,
            ...settings
        };
        this.saveUserPreferences();
    }
    
    /**
     * 获取用户设置
     * @returns {Object} 用户设置
     */
    getSettings() {
        return this.userPreferences.settings || {
            theme: 'light',
            language: 'zh'
        };
    }
    
    /**
     * 清除缓存
     */
    clearCache() {
        this.cache = {
            allGames: null,
            gameById: {},
            gamesByCategory: {},
            recommendedGames: {},
            similarGames: {},
            lastFetch: 0
        };
    }
}

// 创建单例实例
const gameDataManager = new GameDataManager();

export default gameDataManager; 