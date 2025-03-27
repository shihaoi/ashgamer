/**
 * 语言工具类
 * 用于处理网站的多语言支持
 */
class LanguageUtil {
    /**
     * 支持的语言列表
     * @type {Object[]}
     */
    static languages = [
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'ar', name: 'عربي', flag: '🇸🇦' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: '한국어', flag: '🇰🇷' }
    ];

    /**
     * 翻译数据
     * @type {Object}
     */
    static translations = {
        'zh': {
            'home': '首页',
            'recently_played': '最近玩过',
            'new_games': '新游戏',
            'trending': '热门游戏',
            'updated': '更新游戏',
            'originals': '原创游戏',
            'multiplayer': '多人游戏',
            'view_more': '查看更多',
            'search': '搜索',
            'about_us': '关于我们',
            'contact': '联系我们',
            'play_with_friends': '与朋友一起玩!',
            'local_multiplayer': '本地多人游戏',
            'online_multiplayer': '在线多人游戏',
            'play_same_device': '在同一设备上玩',
            'play_different_devices': '在不同设备上玩',
            'explore_games': '探索游戏',
            'all_games': '所有游戏',
            'terms': '条款和条件',
            'privacy': '隐私政策'
        },
        'en': {
            'home': 'Home',
            'recently_played': 'Recently Played',
            'new_games': 'New Games',
            'trending': 'Trending',
            'updated': 'Updated',
            'originals': 'Originals',
            'multiplayer': 'Multiplayer',
            'view_more': 'View More',
            'search': 'Search',
            'about_us': 'About Us',
            'contact': 'Contact Us',
            'play_with_friends': 'Play with friends!',
            'local_multiplayer': 'Local Multiplayer',
            'online_multiplayer': 'Online Multiplayer',
            'play_same_device': 'Play on the same device',
            'play_different_devices': 'Play on separate devices',
            'explore_games': 'Explore Games',
            'all_games': 'All Games',
            'terms': 'Terms & Conditions',
            'privacy': 'Privacy Policy'
        }
        // 其他语言可以在这里添加
    };

    /**
     * 当前语言
     * @type {string}
     */
    static currentLanguage = 'zh';

    /**
     * 获取支持的语言列表
     * @returns {Object[]} 语言列表
     */
    static getLanguages() {
        return [...this.languages];
    }

    /**
     * 设置当前语言
     * @param {string} langCode 语言代码
     */
    static setLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            // 保存到本地存储
            localStorage.setItem('language', langCode);
            return true;
        }
        return false;
    }

    /**
     * 获取当前语言代码
     * @returns {string} 当前语言代码
     */
    static getCurrentLanguage() {
        // 如果本地存储中有语言设置，则使用该设置
        const storedLang = localStorage.getItem('language');
        if (storedLang && this.translations[storedLang]) {
            this.currentLanguage = storedLang;
        }
        return this.currentLanguage;
    }

    /**
     * 翻译文本
     * @param {string} key 翻译键
     * @param {Object} params 参数对象，用于替换翻译中的占位符
     * @returns {string} 翻译后的文本
     */
    static translate(key, params = {}) {
        const lang = this.getCurrentLanguage();
        let text = this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
        
        // 替换参数
        if (params) {
            Object.keys(params).forEach(param => {
                text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
            });
        }
        
        return text;
    }

    /**
     * 从浏览器自动检测语言
     * @returns {string} 检测到的语言代码
     */
    static detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // 获取主要语言代码，例如 "zh-CN" -> "zh"
        
        // 检查是否支持该语言
        if (this.translations[langCode]) {
            return langCode;
        }
        
        // 默认为英文
        return 'en';
    }

    /**
     * 初始化语言设置
     */
    static initialize() {
        // 尝试从本地存储获取语言设置
        const storedLang = localStorage.getItem('language');
        
        if (storedLang && this.translations[storedLang]) {
            this.currentLanguage = storedLang;
        } else {
            // 尝试自动检测语言
            this.currentLanguage = this.detectLanguage();
            localStorage.setItem('language', this.currentLanguage);
        }
    }
}

// 初始化语言设置
LanguageUtil.initialize();

// 导出LanguageUtil类
export default LanguageUtil; 