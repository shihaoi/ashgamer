/**
 * SVG占位图生成器
 * 用于动态生成各种尺寸和样式的SVG占位图
 */
class SVGPlaceholder {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     */
    constructor(options = {}) {
        this.options = {
            colors: {
                primary: '#6b46e5',
                secondary: '#5639b8',
                background: '#f0f2f7',
                text: '#333333'
            },
            fontFamily: 'Arial, sans-serif',
            ...options
        };

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // 在页面加载完成后替换占位图
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.replacePlaceholders());
        } else {
            this.replacePlaceholders();
        }

        // 监听动态添加的元素
        this.observeDynamicElements();
    }

    /**
     * 将未加载的图片替换为SVG占位图
     */
    replacePlaceholders() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            
            // 如果图片没有源或者源是空字符串，则替换为占位图
            if (!src || src === '' || src.startsWith('data:')) {
                const parent = img.parentElement;
                const width = img.getAttribute('width') || img.clientWidth || 300;
                const height = img.getAttribute('height') || img.clientHeight || 200;
                const alt = img.getAttribute('alt') || 'Placeholder';
                const classList = img.className;
                let type = 'general';
                
                // 根据类名或父元素确定占位图类型
                if (parent && parent.classList.contains('logo')) {
                    type = 'logo';
                } else if (parent && (parent.classList.contains('game-thumbnail') || parent.classList.contains('game-img'))) {
                    type = 'game';
                } else if (classList && classList.includes('hero')) {
                    type = 'hero';
                }
                
                const svgURL = this.generateSVGDataURL(width, height, alt, type);
                img.setAttribute('src', svgURL);
            }
        });
    }

    /**
     * 观察动态添加的元素
     */
    observeDynamicElements() {
        if (!window.MutationObserver) return;
        
        const observer = new MutationObserver(mutations => {
            let hasNewImages = false;
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            if (node.tagName === 'IMG') {
                                hasNewImages = true;
                            } else if (node.querySelectorAll) {
                                const images = node.querySelectorAll('img');
                                if (images.length) {
                                    hasNewImages = true;
                                }
                            }
                        }
                    }
                }
            });
            
            if (hasNewImages) {
                this.replacePlaceholders();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 生成SVG占位图的Data URL
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     * @param {string} type 类型 (logo, game, hero, general)
     * @returns {string} SVG Data URL
     */
    generateSVGDataURL(width, height, text, type = 'general') {
        const svg = this.createSVG(width, height, text, type);
        const svgString = new XMLSerializer().serializeToString(svg);
        const encodedSVG = encodeURIComponent(svgString);
        return `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
    }

    /**
     * 创建SVG元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     * @param {string} type 类型
     * @returns {SVGElement} SVG元素
     */
    createSVG(width, height, text, type) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // 添加背景
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', width);
        bg.setAttribute('height', height);
        bg.setAttribute('fill', this.options.colors.background);
        svg.appendChild(bg);
        
        // 根据类型生成不同的SVG内容
        switch (type) {
            case 'logo':
                this.createLogoSVG(svg, width, height, text);
                break;
            case 'game':
                this.createGameSVG(svg, width, height, text);
                break;
            case 'hero':
                this.createHeroSVG(svg, width, height, text);
                break;
            default:
                this.createGeneralSVG(svg, width, height, text);
                break;
        }
        
        return svg;
    }

    /**
     * 创建Logo类型的SVG
     * @param {SVGElement} svg SVG元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     */
    createLogoSVG(svg, width, height, text) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const radius = Math.min(width, height) * 0.35;
        circle.setAttribute('cx', width / 2);
        circle.setAttribute('cy', height / 2);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', this.options.colors.primary);
        svg.appendChild(circle);
        
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', width / 2);
        textElem.setAttribute('y', height / 2 + 5);
        textElem.setAttribute('font-family', this.options.fontFamily);
        textElem.setAttribute('font-size', `${radius * 0.8}px`);
        textElem.setAttribute('fill', '#ffffff');
        textElem.setAttribute('text-anchor', 'middle');
        textElem.setAttribute('dominant-baseline', 'middle');
        
        // 获取文本的首字母
        const initial = text.charAt(0).toUpperCase();
        textElem.textContent = initial;
        
        svg.appendChild(textElem);
    }

    /**
     * 创建游戏类型的SVG
     * @param {SVGElement} svg SVG元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     */
    createGameSVG(svg, width, height, text) {
        // 创建渐变背景
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gameGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', this.options.colors.primary);
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', this.options.colors.secondary);
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        
        // 创建背景
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', width);
        bg.setAttribute('height', height);
        bg.setAttribute('fill', 'url(#gameGradient)');
        svg.appendChild(bg);
        
        // 创建游戏控制器图标
        const gamepadSize = Math.min(width, height) * 0.4;
        const gamepadGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gamepadGroup.setAttribute('transform', `translate(${width / 2 - gamepadSize / 2}, ${height / 2 - gamepadSize / 2})`);
        
        // 简化的游戏控制器形状
        const controller = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        controller.setAttribute('d', `
            M${gamepadSize * 0.2},${gamepadSize * 0.4}
            Q${gamepadSize * 0.1},${gamepadSize * 0.5} ${gamepadSize * 0.2},${gamepadSize * 0.6}
            L${gamepadSize * 0.3},${gamepadSize * 0.8}
            Q${gamepadSize * 0.4},${gamepadSize * 0.9} ${gamepadSize * 0.6},${gamepadSize * 0.9}
            L${gamepadSize * 0.7},${gamepadSize * 0.8}
            Q${gamepadSize * 0.8},${gamepadSize * 0.9} ${gamepadSize * 0.9},${gamepadSize * 0.8}
            L${gamepadSize * 0.8},${gamepadSize * 0.6}
            Q${gamepadSize * 0.9},${gamepadSize * 0.5} ${gamepadSize * 0.8},${gamepadSize * 0.4}
            L${gamepadSize * 0.6},${gamepadSize * 0.2}
            Q${gamepadSize * 0.5},${gamepadSize * 0.1} ${gamepadSize * 0.4},${gamepadSize * 0.2}
            Z
        `);
        controller.setAttribute('fill', '#ffffff');
        controller.setAttribute('opacity', '0.8');
        gamepadGroup.appendChild(controller);
        
        // 按钮
        const button1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        button1.setAttribute('cx', gamepadSize * 0.7);
        button1.setAttribute('cy', gamepadSize * 0.5);
        button1.setAttribute('r', gamepadSize * 0.05);
        button1.setAttribute('fill', '#ffffff');
        
        const button2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        button2.setAttribute('cx', gamepadSize * 0.6);
        button2.setAttribute('cy', gamepadSize * 0.4);
        button2.setAttribute('r', gamepadSize * 0.05);
        button2.setAttribute('fill', '#ffffff');
        
        gamepadGroup.appendChild(button1);
        gamepadGroup.appendChild(button2);
        svg.appendChild(gamepadGroup);
        
        // 添加文本
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', width / 2);
        textElem.setAttribute('y', height * 0.85);
        textElem.setAttribute('font-family', this.options.fontFamily);
        textElem.setAttribute('font-size', `${Math.min(width, height) * 0.1}px`);
        textElem.setAttribute('fill', '#ffffff');
        textElem.setAttribute('text-anchor', 'middle');
        
        // 限制文本长度
        let displayText = text;
        if (displayText.length > 15) {
            displayText = displayText.substr(0, 12) + '...';
        }
        textElem.textContent = displayText;
        
        svg.appendChild(textElem);
    }

    /**
     * 创建英雄/头部大图类型的SVG
     * @param {SVGElement} svg SVG元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     */
    createHeroSVG(svg, width, height, text) {
        // 创建渐变背景
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'heroGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#4158D0');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#C850C0');
        
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#FFCC70');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.appendChild(defs);
        
        // 创建背景
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('width', width);
        bg.setAttribute('height', height);
        bg.setAttribute('fill', 'url(#heroGradient)');
        svg.appendChild(bg);
        
        // 添加装饰图形
        for (let i = 0; i < 8; i++) {
            const shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const size = Math.random() * (width * 0.2) + (width * 0.05);
            const x = Math.random() * width;
            const y = Math.random() * height;
            shape.setAttribute('cx', x);
            shape.setAttribute('cy', y);
            shape.setAttribute('r', size);
            shape.setAttribute('fill', '#ffffff');
            shape.setAttribute('opacity', Math.random() * 0.1 + 0.05);
            svg.appendChild(shape);
        }
        
        // 添加文本
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', width / 2);
        textElem.setAttribute('y', height / 2);
        textElem.setAttribute('font-family', this.options.fontFamily);
        textElem.setAttribute('font-size', `${Math.min(width, height) * 0.15}px`);
        textElem.setAttribute('fill', '#ffffff');
        textElem.setAttribute('text-anchor', 'middle');
        textElem.setAttribute('dominant-baseline', 'middle');
        textElem.setAttribute('font-weight', 'bold');
        
        // 限制文本长度
        let displayText = text;
        if (displayText.length > 20) {
            displayText = displayText.substr(0, 17) + '...';
        }
        textElem.textContent = 'HelloGame';
        
        const subtitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subtitle.setAttribute('x', width / 2);
        subtitle.setAttribute('y', height / 2 + Math.min(width, height) * 0.1);
        subtitle.setAttribute('font-family', this.options.fontFamily);
        subtitle.setAttribute('font-size', `${Math.min(width, height) * 0.06}px`);
        subtitle.setAttribute('fill', '#ffffff');
        subtitle.setAttribute('text-anchor', 'middle');
        subtitle.setAttribute('dominant-baseline', 'middle');
        subtitle.textContent = '免费在线HTML5游戏';
        
        svg.appendChild(textElem);
        svg.appendChild(subtitle);
    }

    /**
     * 创建通用类型的SVG
     * @param {SVGElement} svg SVG元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} text 文本
     */
    createGeneralSVG(svg, width, height, text) {
        // 创建几何图形背景
        const centerX = width / 2;
        const centerY = height / 2;
        const minDimension = Math.min(width, height);
        
        // 创建圆形
        const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle1.setAttribute('cx', centerX - minDimension * 0.15);
        circle1.setAttribute('cy', centerY - minDimension * 0.15);
        circle1.setAttribute('r', minDimension * 0.1);
        circle1.setAttribute('fill', this.options.colors.primary);
        circle1.setAttribute('opacity', '0.7');
        svg.appendChild(circle1);
        
        // 创建矩形
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', centerX - minDimension * 0.3);
        rect.setAttribute('y', centerY + minDimension * 0.1);
        rect.setAttribute('width', minDimension * 0.1);
        rect.setAttribute('height', minDimension * 0.1);
        rect.setAttribute('fill', this.options.colors.primary);
        rect.setAttribute('opacity', '0.7');
        svg.appendChild(rect);
        
        // 创建三角形
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const triangleSize = minDimension * 0.15;
        triangle.setAttribute('points', `
            ${centerX},${centerY - triangleSize / 2}
            ${centerX + triangleSize / 2},${centerY + triangleSize / 2}
            ${centerX - triangleSize / 2},${centerY + triangleSize / 2}
        `);
        triangle.setAttribute('fill', this.options.colors.secondary);
        triangle.setAttribute('opacity', '0.7');
        svg.appendChild(triangle);
        
        // 创建另一个圆形
        const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle2.setAttribute('cx', centerX + minDimension * 0.2);
        circle2.setAttribute('cy', centerY + minDimension * 0.1);
        circle2.setAttribute('r', minDimension * 0.08);
        circle2.setAttribute('fill', this.options.colors.primary);
        circle2.setAttribute('opacity', '0.7');
        svg.appendChild(circle2);
        
        // 添加文本
        if (minDimension > 100) {
            const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElem.setAttribute('x', width / 2);
            textElem.setAttribute('y', height * 0.85);
            textElem.setAttribute('font-family', this.options.fontFamily);
            textElem.setAttribute('font-size', `${Math.min(width, height) * 0.08}px`);
            textElem.setAttribute('fill', this.options.colors.text);
            textElem.setAttribute('text-anchor', 'middle');
            
            // 限制文本长度
            let displayText = text;
            if (displayText.length > 20) {
                displayText = displayText.substr(0, 17) + '...';
            }
            textElem.textContent = displayText;
            
            svg.appendChild(textElem);
        }
    }
}

// 创建占位图生成器实例
const svgPlaceholder = new SVGPlaceholder(); 