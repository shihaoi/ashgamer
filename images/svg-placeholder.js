/**
 * SVG占位图生成器
 * 用于生成各种类型的占位SVG图像
 */
class SVGPlaceholder {
  /**
   * 创建游戏卡片图像
   * @param {string} title 游戏标题
   * @param {string} category 游戏分类
   * @param {string} color 主要颜色
   * @returns {string} SVG图像的Data URL
   */
  static createGameCard(title, category, color = '#4a6cf7') {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
        <rect width="480" height="270" fill="${color}" opacity="0.2"/>
        <rect width="480" height="270" fill="url(#game-pattern)" opacity="0.3"/>
        <rect width="480" height="270" stroke="${color}" stroke-width="2" fill="none"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#333">${title}</text>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#666">${category}</text>
        <defs>
          <pattern id="game-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="2" height="2" fill="${color}" opacity="0.3"/>
          </pattern>
        </defs>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  
  /**
   * 创建Logo图像
   * @returns {string} SVG图像的Data URL
   */
  static createLogo() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
        <text x="50%" y="48%" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#4a6cf7">
          HelloGame
        </text>
        <circle cx="20" cy="25" r="15" fill="#4a6cf7" opacity="0.8"/>
        <path d="M15,23 L15,27 L25,27 L25,32 L29,25 L25,18 L25,23 Z" fill="white"/>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /**
   * 创建Hero背景图像
   * @returns {string} SVG图像的Data URL
   */
  static createHeroBackground() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <rect width="800" height="400" fill="#4a6cf7" opacity="0.1"/>
        <rect width="800" height="400" fill="url(#hero-pattern)" opacity="0.4"/>
        <g transform="translate(400, 200)">
          <circle cx="0" cy="0" r="100" fill="#4a6cf7" opacity="0.2"/>
          <circle cx="-120" cy="-60" r="40" fill="#4a6cf7" opacity="0.3"/>
          <circle cx="150" cy="80" r="60" fill="#4a6cf7" opacity="0.1"/>
          <path d="M-50,-50 L50,-50 L0,50 Z" fill="#4a6cf7" opacity="0.2"/>
          <rect x="-180" y="20" width="80" height="80" rx="10" fill="#4a6cf7" opacity="0.2"/>
        </g>
        <defs>
          <pattern id="hero-pattern" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(30)">
            <rect width="3" height="3" fill="#4a6cf7" opacity="0.2"/>
          </pattern>
        </defs>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /**
   * 创建关于我们图像
   * @returns {string} SVG图像的Data URL
   */
  static createAboutImage() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#f7f9fc"/>
        <rect width="600" height="400" fill="url(#about-pattern)" opacity="0.4"/>
        <g transform="translate(300, 200)">
          <circle cx="0" cy="0" r="80" fill="#4a6cf7" opacity="0.1"/>
          <rect x="-150" y="-30" width="300" height="60" rx="10" fill="#4a6cf7" opacity="0.1"/>
          <text x="0" y="10" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#333">关于 HelloGame</text>
          <path d="M-40,50 L40,50 L0,90 Z" fill="#4a6cf7" opacity="0.2"/>
        </g>
        <defs>
          <pattern id="about-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="2" height="2" fill="#4a6cf7" opacity="0.1"/>
          </pattern>
        </defs>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /**
   * 替换图片元素的src为SVG数据
   * @param {boolean} useSVGPlaceholders 是否使用SVG占位图
   */
  static replacePlaceholders(useSVGPlaceholders = true) {
    if (!useSVGPlaceholders) return;
    
    // 替换Logo
    const logoImgs = document.querySelectorAll('.logo img');
    logoImgs.forEach(img => {
      img.src = SVGPlaceholder.createLogo();
      img.classList.remove('lazy');
    });
    
    // 替换Hero背景图
    const heroImgs = document.querySelectorAll('.hero-image img');
    heroImgs.forEach(img => {
      img.src = SVGPlaceholder.createHeroBackground();
      img.classList.remove('lazy');
    });
    
    // 替换关于我们图像
    const aboutImgs = document.querySelectorAll('.about-image img');
    aboutImgs.forEach(img => {
      img.src = SVGPlaceholder.createAboutImage();
      img.classList.remove('lazy');
    });
    
    // 替换游戏卡片图像
    const gameImages = document.querySelectorAll('.game-img img, .original-game-img img, .game-thumbnail img');
    gameImages.forEach(img => {
      const title = img.getAttribute('alt') || '游戏';
      const category = img.closest('.game-card') ? 
        img.closest('.game-card').querySelector('.game-category')?.textContent || '休闲' : 
        '休闲';
      
      // 为不同游戏生成不同颜色
      let color = '#4a6cf7';
      if (title.includes('贪吃蛇')) color = '#5cb85c';
      if (title.includes('射击')) color = '#d9534f';
      if (title.includes('方块') || title.includes('俄罗斯')) color = '#f0ad4e';
      if (title.includes('2048')) color = '#5bc0de';
      
      img.src = SVGPlaceholder.createGameCard(title, category, color);
      img.classList.remove('lazy');
    });
  }
}

// 在DOM加载完成后自动替换占位图
document.addEventListener('DOMContentLoaded', () => {
  SVGPlaceholder.replacePlaceholders();
}); 