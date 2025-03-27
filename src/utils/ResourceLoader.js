/**
 * 资源加载管理器
 * 提供资源懒加载、预加载和优先级管理
 */
class ResourceLoader {
  /**
   * 构造函数
   * @param {Object} options 配置选项
   */
  constructor(options = {}) {
    // 默认选项
    this.options = {
      concurrency: 5, // 同时加载的最大资源数
      timeout: 30000, // 加载超时时间（毫秒）
      retries: 2, // 失败后重试次数
      cacheEnabled: true, // 启用缓存
      priorityLevels: 3, // 优先级级别数
      ...options
    };
    
    // 队列数组，每个优先级一个队列
    this.queues = Array(this.options.priorityLevels)
      .fill(null)
      .map(() => []);
    
    // 正在加载的资源数
    this.loading = 0;
    
    // 缓存已加载的资源
    this.cache = new Map();
    
    // 记录资源加载统计
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      cached: 0
    };
    
    // 是否正在处理队列
    this.isProcessing = false;
  }
  
  /**
   * 加载资源
   * @param {string} url 资源URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  load(url, options = {}) {
    // 默认选项
    const loadOptions = {
      type: this.getResourceType(url), // 资源类型（自动检测）
      priority: 1, // 默认中等优先级
      timeout: this.options.timeout,
      retries: this.options.retries,
      ...options
    };
    
    // 确保优先级在有效范围内
    const priority = Math.max(0, Math.min(this.options.priorityLevels - 1, loadOptions.priority));
    
    // 创建加载任务Promise
    return new Promise((resolve, reject) => {
      // 检查缓存
      if (this.options.cacheEnabled && this.cache.has(url)) {
        this.stats.cached++;
        resolve(this.cache.get(url));
        return;
      }
      
      // 创建加载任务
      const task = {
        url,
        options: { ...loadOptions, priority },
        resolve,
        reject,
        attempts: 0
      };
      
      // 添加到相应优先级的队列
      this.queues[priority].push(task);
      this.stats.total++;
      
      // 开始处理队列
      this.processQueue();
    });
  }
  
  /**
   * 处理队列
   */
  processQueue() {
    // 如果已经在处理队列或没有更多容量，则返回
    if (this.isProcessing || this.loading >= this.options.concurrency) {
      return;
    }
    
    this.isProcessing = true;
    
    // 尝试从最高优先级开始获取任务
    let task = null;
    for (let i = 0; i < this.queues.length; i++) {
      if (this.queues[i].length > 0) {
        task = this.queues[i].shift();
        break;
      }
    }
    
    // 如果没有任务，则结束处理
    if (!task) {
      this.isProcessing = false;
      return;
    }
    
    // 增加正在加载计数
    this.loading++;
    
    // 执行加载
    this.loadResource(task)
      .then(result => {
        // 减少正在加载计数
        this.loading--;
        
        // 缓存结果
        if (this.options.cacheEnabled) {
          this.cache.set(task.url, result);
        }
        
        // 解析任务Promise
        task.resolve(result);
        this.stats.success++;
      })
      .catch(error => {
        // 减少正在加载计数
        this.loading--;
        
        // 如果尚未达到最大重试次数，则重新加入队列
        if (task.attempts < task.options.retries) {
          task.attempts++;
          // 降低优先级并重新加入队列
          const newPriority = Math.min(task.options.priority + 1, this.options.priorityLevels - 1);
          this.queues[newPriority].push(task);
        } else {
          // 超过重试次数，拒绝任务Promise
          task.reject(error);
          this.stats.failed++;
        }
      })
      .finally(() => {
        // 继续处理队列
        this.isProcessing = false;
        this.processQueue();
        
        // 如果还有容量，启动另一个处理
        if (this.loading < this.options.concurrency) {
          setTimeout(() => this.processQueue(), 0);
        }
      });
  }
  
  /**
   * 加载资源
   * @param {Object} task 加载任务
   * @returns {Promise} 加载完成的Promise
   */
  loadResource(task) {
    const { url, options } = task;
    
    // 根据资源类型选择加载方法
    switch (options.type) {
      case 'image':
        return this.loadImage(url, options);
      case 'script':
        return this.loadScript(url, options);
      case 'style':
        return this.loadStyle(url, options);
      case 'json':
        return this.loadJson(url, options);
      case 'font':
        return this.loadFont(url, options);
      default:
        return this.loadGeneric(url, options);
    }
  }
  
  /**
   * 加载图片
   * @param {string} url 图片URL
   * @param {Object} options 加载选项
   * @returns {Promise<HTMLImageElement>} 加载完成的Promise
   */
  loadImage(url, options) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let timeoutId = null;
      
      // 设置超时
      if (options.timeout > 0) {
        timeoutId = setTimeout(() => {
          reject(new Error(`图片加载超时: ${url}`));
        }, options.timeout);
      }
      
      // 加载完成处理
      img.onload = () => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(img);
      };
      
      // 加载错误处理
      img.onerror = () => {
        if (timeoutId) clearTimeout(timeoutId);
        reject(new Error(`图片加载失败: ${url}`));
      };
      
      // 开始加载
      img.src = url;
    });
  }
  
  /**
   * 加载脚本
   * @param {string} url 脚本URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  loadScript(url, options) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let timeoutId = null;
      
      // 设置超时
      if (options.timeout > 0) {
        timeoutId = setTimeout(() => {
          reject(new Error(`脚本加载超时: ${url}`));
        }, options.timeout);
      }
      
      // 加载完成处理
      script.onload = () => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(script);
      };
      
      // 加载错误处理
      script.onerror = () => {
        if (timeoutId) clearTimeout(timeoutId);
        document.head.removeChild(script);
        reject(new Error(`脚本加载失败: ${url}`));
      };
      
      // 设置属性并添加到文档
      script.src = url;
      script.async = true;
      
      if (options.defer) {
        script.defer = true;
      }
      
      if (options.crossOrigin) {
        script.crossOrigin = options.crossOrigin;
      }
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * 加载样式
   * @param {string} url 样式URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  loadStyle(url, options) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      let timeoutId = null;
      
      // 设置超时
      if (options.timeout > 0) {
        timeoutId = setTimeout(() => {
          reject(new Error(`样式加载超时: ${url}`));
        }, options.timeout);
      }
      
      // 加载完成处理
      link.onload = () => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(link);
      };
      
      // 加载错误处理
      link.onerror = () => {
        if (timeoutId) clearTimeout(timeoutId);
        document.head.removeChild(link);
        reject(new Error(`样式加载失败: ${url}`));
      };
      
      // 设置属性并添加到文档
      link.rel = 'stylesheet';
      link.href = url;
      
      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin;
      }
      
      document.head.appendChild(link);
    });
  }
  
  /**
   * 加载JSON
   * @param {string} url JSON URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  loadJson(url, options) {
    return fetch(url, {
      credentials: options.credentials || 'same-origin',
      signal: options.timeout > 0 ? AbortSignal.timeout(options.timeout) : undefined
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      return response.json();
    });
  }
  
  /**
   * 加载字体
   * @param {string} url 字体URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  loadFont(url, options) {
    const fontName = options.fontName || `font-${Date.now()}`;
    
    // 创建@font-face规则
    const fontFace = new FontFace(fontName, `url(${url})`, {
      style: options.fontStyle || 'normal',
      weight: options.fontWeight || 'normal',
      display: options.fontDisplay || 'swap'
    });
    
    // 加载字体
    return fontFace.load()
      .then(loadedFace => {
        // 添加到字体集
        document.fonts.add(loadedFace);
        return loadedFace;
      });
  }
  
  /**
   * 通用资源加载
   * @param {string} url 资源URL
   * @param {Object} options 加载选项
   * @returns {Promise} 加载完成的Promise
   */
  loadGeneric(url, options) {
    return fetch(url, {
      credentials: options.credentials || 'same-origin',
      signal: options.timeout > 0 ? AbortSignal.timeout(options.timeout) : undefined
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      return response;
    });
  }
  
  /**
   * 预加载资源
   * @param {string[]} urls 资源URL数组
   * @param {Object} options 加载选项
   * @returns {Promise} 所有资源加载完成的Promise
   */
  preload(urls, options = {}) {
    // 默认低优先级
    const preloadOptions = {
      priority: this.options.priorityLevels - 1,
      ...options
    };
    
    // 创建所有加载任务
    const promises = urls.map(url => this.load(url, preloadOptions));
    
    // 等待所有任务完成
    return Promise.all(promises);
  }
  
  /**
   * 根据URL获取资源类型
   * @param {string} url 资源URL
   * @returns {string} 资源类型
   */
  getResourceType(url) {
    const extension = url.split('.').pop().toLowerCase();
    
    // 根据文件扩展名判断资源类型
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'image';
        
      case 'js':
        return 'script';
        
      case 'css':
        return 'style';
        
      case 'json':
        return 'json';
        
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
      case 'eot':
        return 'font';
        
      default:
        return 'generic';
    }
  }
  
  /**
   * 清除缓存
   * @param {string|null} url 特定资源URL，为null则清除所有缓存
   */
  clearCache(url = null) {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * 获取加载统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return { ...this.stats };
  }
  
  /**
   * 重置加载器状态
   */
  reset() {
    // 清空所有队列
    this.queues.forEach(queue => queue.length = 0);
    
    // 重置统计
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      cached: 0
    };
    
    // 清除缓存
    this.cache.clear();
  }
}

export default ResourceLoader; 