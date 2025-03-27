/**
 * 游戏数据API
 * 提供游戏数据的获取和管理功能
 */

// 游戏数据
const gamesData = [
  {
    id: "snake",
    title: "贪吃蛇",
    description: "经典的贪吃蛇游戏，控制蛇吃食物并不断成长，但要避免撞到墙壁或自己的身体！",
    thumbnail: "/public/images/games/snake.jpg",
    url: "/public/games/snake.html",
    categories: ["休闲", "单人"],
    tags: ["经典", "简单", "技巧"],
    developer: "HelloGame工作室",
    releaseDate: "2023-01-15",
    rating: 4.5,
    playCount: 12580,
    controls: "使用方向键控制蛇的移动方向",
    isNew: false,
    isFeatured: true
  },
  {
    id: "spaceshooter",
    title: "太空射击",
    description: "控制宇宙飞船击败外星入侵者！躲避敌人的攻击，收集能量提升，尽可能获得高分！",
    thumbnail: "/public/images/games/spaceshooter.jpg",
    url: "/public/games/spaceshooter.html",
    categories: ["动作", "射击", "单人"],
    tags: ["太空", "射击", "快节奏"],
    developer: "HelloGame工作室",
    releaseDate: "2023-03-22",
    rating: 4.7,
    playCount: 8640,
    controls: "使用方向键移动飞船，空格键发射子弹",
    isNew: true,
    isFeatured: true
  },
  {
    id: "2048",
    title: "2048",
    description: "通过合并相同数字的方块来获得2048。一款简单但极具挑战性的益智游戏！",
    thumbnail: "/public/images/games/2048.jpg",
    url: "/public/games/2048.html",
    categories: ["益智", "单人"],
    tags: ["数字", "战略", "益智"],
    developer: "数字游戏工作室",
    releaseDate: "2022-11-05",
    rating: 4.8,
    playCount: 15960,
    controls: "使用方向键滑动所有方块",
    isNew: false,
    isFeatured: true
  },
  {
    id: "tetris",
    title: "俄罗斯方块",
    description: "经典的俄罗斯方块游戏，通过旋转和移动下落的方块来填满横行并消除它们。",
    thumbnail: "/public/images/games/tetris.jpg",
    url: "/public/games/tetris.html",
    categories: ["休闲", "益智", "单人"],
    tags: ["经典", "技巧", "挑战"],
    developer: "复古游戏工作室",
    releaseDate: "2022-08-18",
    rating: 4.6,
    playCount: 19800,
    controls: "方向键控制移动和旋转，空格键快速下落",
    isNew: false,
    isFeatured: false
  },
  {
    id: "flappybird",
    title: "像素鸟",
    description: "控制一只小鸟飞行，躲避绿色管道。看似简单，实则极具挑战性！",
    thumbnail: "/public/images/games/flappybird.jpg",
    url: "/public/games/flappybird.html",
    categories: ["休闲", "单人"],
    tags: ["像素风", "挑战", "上瘾"],
    developer: "像素艺术工作室",
    releaseDate: "2023-02-10",
    rating: 4.3,
    playCount: 21500,
    controls: "点击屏幕或按空格键使小鸟跳跃",
    isNew: false,
    isFeatured: false
  },
  {
    id: "chess",
    title: "在线国际象棋",
    description: "经典的国际象棋游戏，支持双人对战和AI对战。提升您的策略思维！",
    thumbnail: "/public/images/games/chess.jpg",
    url: "/public/games/chess.html",
    categories: ["桌游", "策略", "双人"],
    tags: ["经典", "智力", "策略"],
    developer: "棋类游戏工作室",
    releaseDate: "2022-07-12",
    rating: 4.9,
    playCount: 7820,
    controls: "使用鼠标选择和移动棋子",
    isNew: false,
    isFeatured: false
  },
  {
    id: "pong",
    title: "经典乒乓",
    description: "重温最早的电子游戏之一！一款简单的乒乓球游戏，支持单人或双人游戏模式。",
    thumbnail: "/public/images/games/pong.jpg",
    url: "/public/games/pong.html",
    categories: ["休闲", "体育", "双人"],
    tags: ["经典", "简单", "复古"],
    developer: "复古游戏工作室",
    releaseDate: "2022-05-30",
    rating: 4.2,
    playCount: 6450,
    controls: "使用W/S或上/下方向键控制球拍",
    isNew: false,
    isFeatured: false
  },
  {
    id: "breakout",
    title: "打砖块",
    description: "使用球拍反弹球以击碎所有砖块。一款经典的街机游戏，简单但上瘾！",
    thumbnail: "/public/images/games/breakout.jpg",
    url: "/public/games/breakout.html",
    categories: ["休闲", "街机", "单人"],
    tags: ["经典", "反应", "技巧"],
    developer: "复古游戏工作室",
    releaseDate: "2022-09-14",
    rating: 4.4,
    playCount: 9720,
    controls: "使用鼠标或左右方向键移动球拍",
    isNew: false,
    isFeatured: false
  },
  {
    id: "pacman",
    title: "吃豆人",
    description: "在迷宫中控制吃豆人吃掉所有豆子，同时避开鬼怪。适时吃掉能量豆可以反击鬼怪！",
    thumbnail: "/public/images/games/pacman.jpg",
    url: "/public/games/pacman.html",
    categories: ["街机", "迷宫", "单人"],
    tags: ["经典", "策略", "街机"],
    developer: "复古游戏工作室",
    releaseDate: "2022-06-08",
    rating: 4.7,
    playCount: 14230,
    controls: "使用方向键控制吃豆人移动",
    isNew: false,
    isFeatured: false
  },
  {
    id: "memorymatch",
    title: "记忆配对",
    description: "翻开卡片并找到匹配的对。训练您的记忆力和专注力的完美游戏！",
    thumbnail: "/public/images/games/memorymatch.jpg",
    url: "/public/games/memorymatch.html",
    categories: ["休闲", "益智", "单人"],
    tags: ["记忆", "简单", "休闲"],
    developer: "脑力游戏工作室",
    releaseDate: "2023-04-05",
    rating: 4.3,
    playCount: 5890,
    controls: "使用鼠标点击卡片",
    isNew: true,
    isFeatured: false
  }
];

// 缓存对象
let cache = {
  allGames: null,
  gameById: {},
  gamesByCategory: {},
  featuredGames: null,
  newGames: null,
};

/**
 * 获取所有游戏
 * @param {Object} options 过滤和排序选项
 * @returns {Promise<Array>} 游戏数组
 */
export const getAllGames = (options = {}) => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      if (!cache.allGames) {
        cache.allGames = [...gamesData];
      }
      
      let result = [...cache.allGames];
      
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
          // 默认不排序，保持原始顺序
        }
      }
      
      // 分页
      if (options.limit && options.limit > 0) {
        const offset = options.offset || 0;
        result = result.slice(offset, offset + options.limit);
      }
      
      resolve(result);
    }, 300); // 模拟300ms的延迟
  });
};

/**
 * 获取单个游戏
 * @param {string} id 游戏ID
 * @returns {Promise<Object>} 游戏对象
 */
export const getGameById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cache.gameById[id]) {
        resolve(cache.gameById[id]);
        return;
      }
      
      const game = gamesData.find(g => g.id === id);
      
      if (game) {
        cache.gameById[id] = {...game};
        resolve(cache.gameById[id]);
      } else {
        reject(new Error(`游戏ID "${id}"不存在`));
      }
    }, 200);
  });
};

/**
 * 获取特定类别的游戏
 * @param {string} category 类别名称
 * @param {Object} options 过滤和排序选项
 * @returns {Promise<Array>} 游戏数组
 */
export const getGamesByCategory = (category, options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!cache.gamesByCategory[category]) {
        cache.gamesByCategory[category] = gamesData.filter(game => 
          game.categories && game.categories.includes(category)
        );
      }
      
      let result = [...cache.gamesByCategory[category]];
      
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
      
      resolve(result);
    }, 200);
  });
};

/**
 * 获取推荐游戏
 * @param {string} type 推荐类型 ('featured', 'new')
 * @param {number} limit 返回数量限制
 * @returns {Promise<Array>} 游戏数组
 */
export const getRecommendedGames = (type, limit = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result;
      
      if (type === 'featured') {
        if (!cache.featuredGames) {
          cache.featuredGames = gamesData.filter(game => game.isFeatured);
        }
        result = [...cache.featuredGames];
      } else if (type === 'new') {
        if (!cache.newGames) {
          cache.newGames = gamesData.filter(game => game.isNew);
        }
        result = [...cache.newGames];
      } else {
        // 默认返回所有游戏
        result = [...gamesData];
      }
      
      // 限制数量
      if (limit && limit > 0 && result.length > limit) {
        result = result.slice(0, limit);
      }
      
      resolve(result);
    }, 200);
  });
};

/**
 * 增加游戏的播放次数
 * @param {string} id 游戏ID
 * @returns {Promise<Object>} 更新后的游戏对象
 */
export const incrementPlayCount = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const gameIndex = gamesData.findIndex(g => g.id === id);
      
      if (gameIndex >= 0) {
        // 更新原始数据
        gamesData[gameIndex].playCount = (gamesData[gameIndex].playCount || 0) + 1;
        
        // 清除相关缓存
        cache.gameById[id] = null;
        cache.allGames = null;
        
        // 获取更新后的游戏数据
        resolve(getGameById(id));
      } else {
        reject(new Error(`游戏ID "${id}"不存在`));
      }
    }, 100);
  });
};

/**
 * 获取相似游戏
 * @param {string} gameId 游戏ID
 * @param {number} limit 返回数量限制
 * @returns {Promise<Array>} 相似游戏数组
 */
export const getSimilarGames = (gameId, limit = 4) => {
  return new Promise((resolve, reject) => {
    // 首先获取目标游戏
    getGameById(gameId)
      .then(game => {
        // 获取所有其他游戏
        getAllGames()
          .then(allGames => {
            // 过滤掉当前游戏
            const otherGames = allGames.filter(g => g.id !== gameId);
            
            // 计算相似度分数
            const scoredGames = otherGames.map(otherGame => {
              let score = 0;
              
              // 基于类别的相似度
              if (game.categories && otherGame.categories) {
                const commonCategories = game.categories.filter(c => 
                  otherGame.categories.includes(c)
                ).length;
                score += commonCategories * 2; // 类别匹配权重较高
              }
              
              // 基于标签的相似度
              if (game.tags && otherGame.tags) {
                const commonTags = game.tags.filter(t => 
                  otherGame.tags.includes(t)
                ).length;
                score += commonTags;
              }
              
              // 相同开发者加分
              if (game.developer && game.developer === otherGame.developer) {
                score += 1;
              }
              
              return { ...otherGame, similarityScore: score };
            });
            
            // 按相似度排序并限制数量
            const similarGames = scoredGames
              .sort((a, b) => b.similarityScore - a.similarityScore)
              .slice(0, limit);
            
            resolve(similarGames);
          });
      })
      .catch(err => reject(err));
  });
};

/**
 * 搜索游戏
 * @param {string} query 搜索关键词
 * @param {Object} options 过滤和排序选项
 * @returns {Promise<Array>} 游戏数组
 */
export const searchGames = (query, options = {}) => {
  return getAllGames({ ...options, search: query });
};

/**
 * 获取所有游戏类别和标签
 * @returns {Promise<Object>} 包含类别和标签的对象
 */
export const getGamesCategoriesAndTags = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = new Set();
      const tags = new Set();
      
      // 收集所有类别和标签
      gamesData.forEach(game => {
        if (game.categories) {
          game.categories.forEach(category => categories.add(category));
        }
        if (game.tags) {
          game.tags.forEach(tag => tags.add(tag));
        }
      });
      
      resolve({
        categories: Array.from(categories),
        tags: Array.from(tags)
      });
    }, 100);
  });
};

export default {
  getAllGames,
  getGameById,
  getGamesByCategory,
  getRecommendedGames,
  incrementPlayCount,
  getSimilarGames,
  searchGames,
  getGamesCategoriesAndTags
}; 