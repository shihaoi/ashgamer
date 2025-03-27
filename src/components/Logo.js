/**
 * Logo组件
 * 用于生成网站的SVG格式Logo
 */
class Logo {
    /**
     * 创建一个新的Logo实例
     * @param {string} text Logo文本
     * @param {string} color Logo颜色
     */
    constructor(text = 'CrazyGames', color = '#6b46e5') {
        this.text = text;
        this.color = color;
    }

    /**
     * 生成SVG格式的Logo
     * @returns {string} SVG格式的Logo
     */
    generateSVG() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50">
            <text x="10" y="35" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="${this.color}">
                ${this.text}
            </text>
        </svg>
        `;
    }

    /**
     * 将Logo应用到指定的DOM元素
     * @param {HTMLElement} element 要应用Logo的DOM元素
     */
    applyTo(element) {
        if (!element) return;
        element.innerHTML = this.generateSVG();
    }
}

// 导出Logo类
export default Logo; 