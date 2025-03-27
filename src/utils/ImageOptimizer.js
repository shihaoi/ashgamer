/**
 * 图片优化助手
 * 提供图片懒加载、尺寸优化和格式转换等功能
 */
class ImageOptimizer {
  /**
   * 构造函数
   * @param {Object} options 配置选项
   */
  constructor(options = {}) {
    // 默认选项
    this.options = {
      lazyLoadEnabled: true,
      lazyLoadThreshold: 200, // 预加载阈值（像素）
      placeholderColor: '#f0f0f0',
      defaultQuality: 80,
      webpEnabled: true,
      ...options
    };
    
    // 存储观察器实例
    this.observer = null;
    
    // 存储已处理的图片
    this.processedImages = new Set();
    
    // 检查浏览器是否支持IntersectionObserver
    this.supportsIntersection = 'IntersectionObserver' in window;
    
    // 检查浏览器是否支持WebP
    this.supportsWebP = false;
    this.checkWebPSupport();
  }
  
  /**
   * 检查浏览器是否支持WebP格式
   */
  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // 如果浏览器支持canvas，尝试将canvas转换为WebP格式的数据URL
      this.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  }
  
  /**
   * 初始化图片优化
   * @param {string} selector 图片选择器
   */
  init(selector = 'img.lazy') {
    if (this.options.lazyLoadEnabled && this.supportsIntersection) {
      this.setupLazyLoading(selector);
    } else {
      // 如果不支持懒加载，则立即加载所有图片
      this.loadAllImages(selector);
    }
  }
  
  /**
   * 设置懒加载
   * @param {string} selector 图片选择器
   */
  setupLazyLoading(selector) {
    // 创建IntersectionObserver实例
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // 当图片进入视口时
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          
          // 停止观察该图片
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: `${this.options.lazyLoadThreshold}px 0px`,
      threshold: 0.01
    });
    
    // 开始观察符合选择器的所有图片
    document.querySelectorAll(selector).forEach(img => {
      if (!this.processedImages.has(img)) {
        this.setupPlaceholder(img);
        this.observer.observe(img);
        this.processedImages.add(img);
      }
    });
  }
  
  /**
   * 设置图片占位符
   * @param {HTMLImageElement} img 图片元素
   */
  setupPlaceholder(img) {
    // 保存原始图片URL到data属性
    if (img.dataset.src === undefined && img.src) {
      img.dataset.src = img.src;
    }
    
    // 如果没有设置src或只有data-src，则设置占位符
    if (!img.src || img.src === img.dataset.src) {
      // 获取图片尺寸
      const width = img.width || 100;
      const height = img.height || 100;
      
      // 创建占位符
      const placeholderSrc = this.createPlaceholder(width, height);
      img.src = placeholderSrc;
    }
    
    // 添加淡入效果的样式
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '0.5';
  }
  
  /**
   * 创建图片占位符
   * @param {number} width 宽度
   * @param {number} height 高度
   * @returns {string} 占位符的data URL
   */
  createPlaceholder(width, height) {
    // 使用SVG创建占位符
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="${this.options.placeholderColor}"/>
      </svg>
    `;
    
    // 转换为base64
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  
  /**
   * 加载图片
   * @param {HTMLImageElement} img 图片元素
   */
  loadImage(img) {
    if (!img.dataset.src) return;
    
    // 选择合适的图片URL
    const src = this.getOptimalImageUrl(img.dataset.src);
    
    // 创建新的Image对象进行预加载
    const imgLoader = new Image();
    imgLoader.onload = () => {
      // 图片加载完成后，更新原始img元素
      img.src = src;
      img.style.opacity = '1';
    };
    
    imgLoader.onerror = () => {
      // 如果加载失败，回退到原始URL
      console.warn(`图片加载失败: ${src}, 回退到原始URL: ${img.dataset.src}`);
      img.src = img.dataset.src;
      img.style.opacity = '1';
    };
    
    // 开始加载图片
    imgLoader.src = src;
  }
  
  /**
   * 获取最优的图片URL
   * @param {string} originalSrc 原始图片URL
   * @returns {string} 优化后的图片URL
   */
  getOptimalImageUrl(originalSrc) {
    let src = originalSrc;
    
    // 检查是否支持并启用WebP
    if (this.options.webpEnabled && this.supportsWebP) {
      // 检查URL是否已包含查询参数
      const hasQuery = src.includes('?');
      const connector = hasQuery ? '&' : '?';
      
      // 添加WebP转换参数
      src = `${src}${connector}format=webp&quality=${this.options.defaultQuality}`;
    }
    
    return src;
  }
  
  /**
   * 立即加载所有图片
   * @param {string} selector 图片选择器
   */
  loadAllImages(selector) {
    document.querySelectorAll(selector).forEach(img => {
      if (!this.processedImages.has(img) && img.dataset.src) {
        this.loadImage(img);
        this.processedImages.add(img);
      }
    });
  }
  
  /**
   * 动态添加图片后刷新懒加载
   * @param {string} selector 图片选择器
   */
  refresh(selector = 'img.lazy') {
    if (this.options.lazyLoadEnabled && this.supportsIntersection && this.observer) {
      document.querySelectorAll(selector).forEach(img => {
        if (!this.processedImages.has(img)) {
          this.setupPlaceholder(img);
          this.observer.observe(img);
          this.processedImages.add(img);
        }
      });
    } else {
      this.loadAllImages(selector);
    }
  }
  
  /**
   * 销毁懒加载观察器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.processedImages.clear();
  }
}

export default ImageOptimizer; 