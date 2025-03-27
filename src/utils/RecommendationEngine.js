/**
 * 游戏推荐引擎
 * 基于内容和协同过滤的游戏推荐系统
 */
class RecommendationEngine {
    /**
     * 构造函数
     * @param {Object[]} games 游戏数据数组
     * @param {Object[]} [userHistory=[]] 用户历史记录
     */
    constructor(games, userHistory = []) {
        this.games = games || [];
        this.userHistory = userHistory || [];
        this.similarityCache = new Map(); // 缓存相似度计算结果
    }
    
    /**
     * 设置游戏数据
     * @param {Object[]} games 游戏数据数组
     */
    setGames(games) {
        this.games = games || [];
        this.similarityCache.clear(); // 清除缓存
    }
    
    /**
     * 设置用户历史记录
     * @param {Object[]} history 用户历史记录
     */
    setUserHistory(history) {
        this.userHistory = history || [];
    }
    
    /**
     * 添加用户游戏记录
     * @param {Object} record 游戏记录 {gameId, playTime, rating}
     */
    addUserRecord(record) {
        // 检查是否已存在该游戏记录
        const existingIndex = this.userHistory.findIndex(r => r.gameId === record.gameId);
        
        if (existingIndex >= 0) {
            // 更新现有记录
            this.userHistory[existingIndex] = {
                ...this.userHistory[existingIndex],
                playTime: (this.userHistory[existingIndex].playTime || 0) + (record.playTime || 0),
                playCount: (this.userHistory[existingIndex].playCount || 0) + 1,
                rating: record.rating || this.userHistory[existingIndex].rating,
                lastPlayed: new Date().toISOString()
            };
        } else {
            // 添加新记录
            this.userHistory.push({
                gameId: record.gameId,
                playTime: record.playTime || 0,
                playCount: 1,
                rating: record.rating,
                lastPlayed: new Date().toISOString()
            });
        }
        
        // 保存到本地存储
        this.saveUserHistory();
    }
    
    /**
     * 保存用户历史记录到本地存储
     */
    saveUserHistory() {
        try {
            localStorage.setItem('userGameHistory', JSON.stringify(this.userHistory));
        } catch (e) {
            console.error('无法保存用户历史记录:', e);
        }
    }
    
    /**
     * 从本地存储加载用户历史记录
     */
    loadUserHistory() {
        try {
            const history = localStorage.getItem('userGameHistory');
            if (history) {
                this.userHistory = JSON.parse(history);
            }
        } catch (e) {
            console.error('无法加载用户历史记录:', e);
        }
    }
    
    /**
     * 计算基于内容的推荐
     * @param {string} gameId 游戏ID
     * @param {number} [limit=5] 推荐数量限制
     * @returns {Object[]} 推荐游戏数组
     */
    getContentBasedRecommendations(gameId, limit = 5) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return [];
        
        // 计算与其他游戏的相似度
        const recommendations = this.games
            .filter(g => g.id !== gameId) // 排除当前游戏
            .map(g => ({
                ...g,
                similarity: this.calculateGameSimilarity(game, g)
            }))
            .sort((a, b) => b.similarity - a.similarity) // 按相似度降序排序
            .slice(0, limit); // 限制数量
        
        return recommendations;
    }
    
    /**
     * 计算基于用户历史的推荐
     * @param {number} [limit=5] 推荐数量限制
     * @returns {Object[]} 推荐游戏数组
     */
    getUserBasedRecommendations(limit = 5) {
        if (this.userHistory.length === 0) return [];
        
        // 获取用户玩过的游戏ID
        const playedGameIds = this.userHistory.map(record => record.gameId);
        
        // 获取用户未玩过的游戏
        const unplayedGames = this.games.filter(game => !playedGameIds.includes(game.id));
        
        // 计算每个未玩过游戏的推荐分数
        const scoredGames = unplayedGames.map(game => {
            let totalScore = 0;
            
            // 对于用户玩过的每个游戏，计算其与当前未玩过游戏的相似度
            // 然后根据用户对该游戏的喜好程度（游戏时间和评分）加权
            this.userHistory.forEach(record => {
                const playedGame = this.games.find(g => g.id === record.gameId);
                if (!playedGame) return;
                
                const similarity = this.calculateGameSimilarity(game, playedGame);
                
                // 计算用户对已玩游戏的兴趣分数
                let interestScore = 0;
                if (record.rating) {
                    interestScore += record.rating / 5; // 评分0-5分，归一化
                }
                if (record.playTime) {
                    // 游戏时间也影响兴趣度，但设置一个上限
                    interestScore += Math.min(record.playTime / 3600, 1); // 最多1小时计1分
                }
                if (record.playCount) {
                    // 玩的次数也影响兴趣度
                    interestScore += Math.min(record.playCount / 10, 1); // 最多10次计1分
                }
                
                // 加权求和
                totalScore += similarity * interestScore;
            });
            
            return {
                ...game,
                score: totalScore
            };
        });
        
        // 按推荐分数排序
        return scoredGames
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    
    /**
     * 获取混合推荐
     * @param {string} [currentGameId=null] 当前游戏ID
     * @param {number} [limit=10] 推荐数量限制
     * @returns {Object[]} 推荐游戏数组
     */
    getHybridRecommendations(currentGameId = null, limit = 10) {
        // 获取两种推荐结果
        const contentBased = currentGameId ? 
            this.getContentBasedRecommendations(currentGameId, limit) : [];
        const userBased = this.getUserBasedRecommendations(limit);
        
        // 如果用户没有历史记录，只返回基于内容的推荐
        if (userBased.length === 0) return contentBased;
        
        // 如果没有当前游戏，只返回基于用户的推荐
        if (contentBased.length === 0) return userBased;
        
        // 合并两种推荐并去重
        const recommendations = [];
        const addedGameIds = new Set();
        
        // 先添加一些基于内容的推荐
        for (let i = 0; i < contentBased.length && recommendations.length < limit / 2; i++) {
            if (!addedGameIds.has(contentBased[i].id)) {
                recommendations.push(contentBased[i]);
                addedGameIds.add(contentBased[i].id);
            }
        }
        
        // 再添加一些基于用户的推荐
        for (let i = 0; i < userBased.length && recommendations.length < limit; i++) {
            if (!addedGameIds.has(userBased[i].id)) {
                recommendations.push(userBased[i]);
                addedGameIds.add(userBased[i].id);
            }
        }
        
        // 如果还有空位，补充更多基于内容的推荐
        for (let i = Math.floor(limit / 2); i < contentBased.length && recommendations.length < limit; i++) {
            if (!addedGameIds.has(contentBased[i].id)) {
                recommendations.push(contentBased[i]);
                addedGameIds.add(contentBased[i].id);
            }
        }
        
        return recommendations;
    }
    
    /**
     * 计算两个游戏之间的相似度
     * @param {Object} game1 游戏1
     * @param {Object} game2 游戏2
     * @returns {number} 相似度（0-1之间）
     */
    calculateGameSimilarity(game1, game2) {
        // 检查缓存
        const cacheKey = `${game1.id}-${game2.id}`;
        if (this.similarityCache.has(cacheKey)) {
            return this.similarityCache.get(cacheKey);
        }
        
        // 计算不同特征的相似度
        let similarity = 0;
        let weight = 0;
        
        // 1. 基于类别的相似度
        if (game1.categories && game2.categories) {
            const categoryWeight = 0.5;
            similarity += categoryWeight * this.calculateCategorySimilarity(game1.categories, game2.categories);
            weight += categoryWeight;
        }
        
        // 2. 基于标签的相似度
        if (game1.tags && game2.tags) {
            const tagWeight = 0.3;
            similarity += tagWeight * this.calculateTagSimilarity(game1.tags, game2.tags);
            weight += tagWeight;
        }
        
        // 3. 基于开发者的相似度
        if (game1.developer && game2.developer) {
            const devWeight = 0.2;
            similarity += devWeight * (game1.developer === game2.developer ? 1 : 0);
            weight += devWeight;
        }
        
        // 如果没有任何特征可比较，返回0
        if (weight === 0) return 0;
        
        // 归一化结果
        const normalizedSimilarity = similarity / weight;
        
        // 缓存结果
        this.similarityCache.set(cacheKey, normalizedSimilarity);
        this.similarityCache.set(`${game2.id}-${game1.id}`, normalizedSimilarity); // 相似度是对称的
        
        return normalizedSimilarity;
    }
    
    /**
     * 计算两个游戏的类别相似度
     * @param {string[]} categories1 游戏1的类别
     * @param {string[]} categories2 游戏2的类别
     * @returns {number} 相似度（0-1之间）
     */
    calculateCategorySimilarity(categories1, categories2) {
        if (!categories1 || !categories2 || categories1.length === 0 || categories2.length === 0) {
            return 0;
        }
        
        // 使用Jaccard相似系数
        const intersection = categories1.filter(cat => categories2.includes(cat)).length;
        const union = new Set([...categories1, ...categories2]).size;
        
        return intersection / union;
    }
    
    /**
     * 计算两个游戏的标签相似度
     * @param {string[]} tags1 游戏1的标签
     * @param {string[]} tags2 游戏2的标签
     * @returns {number} 相似度（0-1之间）
     */
    calculateTagSimilarity(tags1, tags2) {
        if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) {
            return 0;
        }
        
        // 使用加权Jaccard相似系数，考虑标签顺序
        let weightedIntersection = 0;
        const maxTags = Math.max(tags1.length, tags2.length);
        
        for (let i = 0; i < tags1.length; i++) {
            const tag = tags1[i];
            const index2 = tags2.indexOf(tag);
            
            if (index2 >= 0) {
                // 相同标签的权重基于它们在各自列表中的位置
                // 位置越靠前，权重越高
                const weight1 = 1 - (i / tags1.length);
                const weight2 = 1 - (index2 / tags2.length);
                weightedIntersection += (weight1 + weight2) / 2;
            }
        }
        
        // 归一化
        return weightedIntersection / maxTags;
    }
}

// 导出RecommendationEngine类
export default RecommendationEngine; 