/**
 * 页面初始化后执行
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSelector();
    initializeMoreCategories();
    initializeGameCards();
});

/**
 * 初始化语言选择器
 */
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // 模拟语言切换
            const selectedLanguage = this.value;
            console.log(`语言已切换为: ${selectedLanguage}`);
            // 在实际应用中，这里会重定向到不同语言的页面
            // window.location.href = `/${selectedLanguage}`;
        });
    }
}

/**
 * 初始化"更多分类"按钮
 */
function initializeMoreCategories() {
    const moreCategories = document.querySelector('.more-categories');
    if (moreCategories) {
        moreCategories.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里可以实现显示更多分类的功能
            console.log('显示更多分类');
            alert('更多游戏分类将在此显示！');
        });
    }
}

/**
 * 初始化游戏卡片点击事件
 */
function initializeGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameName = this.querySelector('h3').textContent;
            console.log(`选择了游戏: ${gameName}`);
            // 在实际应用中，这里会跳转到游戏页面
            // window.location.href = `/games/${gameSlug}`;
            alert(`您选择了游戏: ${gameName}`);
        });
    });
}

/**
 * 滚动时固定导航栏
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

/**
 * 模拟加载更多游戏
 * @param {string} category 游戏类别
 */
function loadMoreGames(category) {
    console.log(`加载更多 ${category} 游戏`);
    // 在实际应用中，这里会通过AJAX请求获取更多游戏
}

/**
 * 简单的游戏搜索功能
 * @param {string} query 搜索关键词
 */
function searchGames(query) {
    if (!query) return;
    console.log(`搜索游戏: ${query}`);
    // 在实际应用中，这里会跳转到搜索结果页面
    // window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

// 添加一些CSS类来支持主题模式切换
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // 保存用户首选项
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 从本地存储中恢复用户主题偏好
function restoreUserPreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// 当DOM加载完成时恢复用户偏好
document.addEventListener('DOMContentLoaded', restoreUserPreference); 