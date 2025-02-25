/**
 * 弹性滚动的配置选项接口
 */
export interface ElasticScrollOptions {
    maxStretch?: number;
    resistance?: number;
    animationDuration?: number;
    animationFunction?: string;
    touchThreshold?: number;
    excludeSelectors?: string[];
}
/**
 * 弹性滚动的核心实现类
 * 负责处理单个滚动容器的弹性效果
 */
export declare class ElasticScroll {
    private element;
    private options;
    private startY;
    private lastY;
    private isTouching;
    private scrollElement;
    private touchMoveTimer;
    private boundTouchStart;
    private boundTouchMove;
    private boundTouchEnd;
    private isSupported;
    private animationFrameId;
    private static defaultOptions;
    /**
     * 检查浏览器是否支持必要的特性
     * 包括触摸事件、classList、transform等现代浏览器特性
     */
    private static checkSupport;
    /**
     * 构造函数
     * @param element 需要添加弹性效果的DOM元素
     * @param options 配置选项
     */
    constructor(element: HTMLElement, options?: ElasticScrollOptions);
    /**
     * 初始化滚动容器
     * 设置必要的样式和事件监听
     */
    private init;
    /**
     * 查找第一个可滚动的子元素
     * 递归遍历DOM树查找可滚动元素
     */
    private findScrollableElement;
    /**
     * 绑定触摸事件处理函数
     */
    private bindEvents;
    /**
     * 检查元素是否在排除列表中
     */
    private isExcluded;
    /**
     * 处理触摸开始事件
     * 记录初始触摸位置并重置样式
     */
    private handleTouchStart;
    /**
     * 处理触摸移动事件
     * 计算并应用弹性效果
     */
    private handleTouchMove;
    /**
     * 查找元素最近的可滚动父元素
     */
    private findScrollableParent;
    /**
     * 处理触摸结束事件
     * 恢复原始状态并播放恢复动画
     */
    private handleTouchEnd;
    /**
     * 更新配置选项
     */
    updateOptions(newOptions: Partial<ElasticScrollOptions>): void;
    /**
     * 销毁实例
     * 清理所有事件监听和样式
     */
    destroy(): void;
}
