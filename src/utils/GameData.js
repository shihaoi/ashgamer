/**
 * 游戏数据管理工具类
 * 用于模拟获取游戏数据的API
 */
class GameData {
    /**
     * 游戏分类
     * @type {Object[]}
     */
    static categories = [
        { id: 'two-player', name: '双人游戏', icon: 'users' },
        { id: 'action', name: '动作游戏', icon: 'running' },
        { id: 'adventure', name: '冒险游戏', icon: 'mountain' },
        { id: 'basketball', name: '篮球游戏', icon: 'basketball-ball' },
        { id: 'beauty', name: '美容游戏', icon: 'paint-brush' },
        { id: 'bike', name: '自行车游戏', icon: 'bicycle' },
        { id: 'car', name: '汽车游戏', icon: 'car' },
        { id: 'card', name: '卡牌游戏', icon: 'cards' },
        { id: 'casual', name: '休闲游戏', icon: 'dice' },
        { id: 'clicker', name: '点击游戏', icon: 'mouse' },
        { id: 'controller', name: '控制器游戏', icon: 'gamepad' },
        { id: 'dress-up', name: '装扮游戏', icon: 'tshirt' },
        { id: 'driving', name: '驾驶游戏', icon: 'car-side' },
        { id: 'escape', name: '逃脱游戏', icon: 'door-open' },
        { id: 'fps', name: 'FPS游戏', icon: 'crosshairs' },
        { id: 'horror', name: '恐怖游戏', icon: 'ghost' },
        { id: 'io', name: '.io游戏', icon: 'globe' },
        { id: 'minecraft', name: 'Minecraft游戏', icon: 'cube' },
        { id: 'puzzle', name: '解谜游戏', icon: 'puzzle-piece' },
        { id: 'shooting', name: '射击游戏', icon: 'bullseye' }
    ];

    /**
     * 获取游戏分类
     * @param {number} limit 获取的分类数量
     * @returns {Object[]} 游戏分类数组
     */
    static getCategories(limit = null) {
        if (limit) {
            return this.categories.slice(0, limit);
        }
        return [...this.categories];
    }

    /**
     * 模拟获取原创游戏列表
     * @param {number} limit 获取的游戏数量
     * @returns {Promise<Object[]>} 游戏数据对象数组
     */
    static async getOriginalGames(limit = 10) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const games = [
            { id: 1, name: 'Space Waves', thumbnail: 'game1.jpg', category: 'action' },
            { id: 2, name: 'Sky Riders', thumbnail: 'game2.jpg', category: 'adventure' },
            { id: 3, name: 'Cubes 2048.io', thumbnail: 'game3.jpg', category: 'io' },
            { id: 4, name: 'Escape From Prison Multiplayer', thumbnail: 'game4.jpg', category: 'escape' },
            { id: 5, name: 'Holey.io Battle Royale', thumbnail: 'game5.jpg', category: 'io' },
            { id: 6, name: 'EvoWars.io', thumbnail: 'game6.jpg', category: 'io' },
            { id: 7, name: 'Race Clicker: Tap Tap Game', thumbnail: 'game7.jpg', category: 'clicker' },
            { id: 8, name: 'Gridpunk - 3v3 Battle Royale', thumbnail: 'game8.jpg', category: 'action' },
            { id: 9, name: 'Jump Guys', thumbnail: 'game9.jpg', category: 'action' },
            { id: 10, name: 'Mini Golf Club', thumbnail: 'game10.jpg', category: 'sports' }
        ];
        
        return games.slice(0, limit);
    }

    /**
     * 模拟获取精选游戏列表
     * @param {number} limit 获取的游戏数量
     * @returns {Promise<Object[]>} 游戏数据对象数组
     */
    static async getFeaturedGames(limit = 6) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const games = [
            { id: 101, name: 'RPG Idle Clicker', thumbnail: 'featured1.jpg', category: 'clicker' },
            { id: 102, name: 'Knock and Run: 100 Doors Escape', thumbnail: 'featured2.jpg', category: 'escape' },
            { id: 103, name: 'Playground Man! Ragdoll Show!', thumbnail: 'featured3.jpg', category: 'casual' },
            { id: 104, name: 'Idle Saga', thumbnail: 'featured4.jpg', category: 'clicker' },
            { id: 105, name: 'Empire Clicker', thumbnail: 'featured5.jpg', category: 'clicker' },
            { id: 106, name: 'Mirrorland', thumbnail: 'featured6.jpg', category: 'adventure' }
        ];
        
        return games.slice(0, limit);
    }

    /**
     * 模拟获取新游戏列表
     * @param {number} limit 获取的游戏数量
     * @returns {Promise<Object[]>} 游戏数据对象数组
     */
    static async getNewGames(limit = 10) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const games = [
            { id: 201, name: 'Draw Climber', thumbnail: 'new1.jpg', category: 'adventure' },
            { id: 202, name: 'Cut in Half, Please!', thumbnail: 'new2.jpg', category: 'puzzle' },
            { id: 203, name: 'Nail Salon', thumbnail: 'new3.jpg', category: 'beauty' },
            { id: 204, name: 'Find the Vampire', thumbnail: 'new4.jpg', category: 'puzzle' },
            { id: 205, name: 'Crusher Block', thumbnail: 'new5.jpg', category: 'casual' },
            { id: 206, name: 'Penguin Restaurant', thumbnail: 'new6.jpg', category: 'casual' },
            { id: 207, name: 'Traffic Rider', thumbnail: 'new7.jpg', category: 'driving' },
            { id: 208, name: 'Fashion Week 2025', thumbnail: 'new8.jpg', category: 'dress-up' },
            { id: 209, name: 'Apocalypse Reborn', thumbnail: 'new9.jpg', category: 'horror' },
            { id: 210, name: 'LetterClash', thumbnail: 'new10.jpg', category: 'puzzle' }
        ];
        
        return games.slice(0, limit);
    }

    /**
     * 模拟搜索游戏
     * @param {string} query 搜索关键词
     * @param {number} limit 最大结果数量
     * @returns {Promise<Object[]>} 搜索结果数组
     */
    static async searchGames(query, limit = 20) {
        // 获取所有游戏数据
        const allGames = [
            ...(await this.getOriginalGames(20)),
            ...(await this.getFeaturedGames(10)),
            ...(await this.getNewGames(20))
        ];
        
        // 模拟搜索功能
        const results = allGames.filter(game => 
            game.name.toLowerCase().includes(query.toLowerCase()) ||
            game.category.toLowerCase().includes(query.toLowerCase())
        );
        
        return results.slice(0, limit);
    }
}

// 导出GameData类
export default GameData; 