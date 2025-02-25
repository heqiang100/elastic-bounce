import { ElasticScroll, ElasticScrollOptions } from './ElasticScroll';

/**
 * 弹性滚动工厂类的配置选项接口
 * 继承自ElasticScrollOptions并添加额外的配置项
 */
export interface ElasticBounceOptions extends ElasticScrollOptions {
    container?: string;         // 容器选择器
    excludeSelectors?: string[]; // 排除的选择器列表
}

/**
 * 弹性滚动工厂类
 * 负责管理多个滚动容器的弹性效果
 */
export class ElasticBounce {
    // 静态属性
    private static instances: Map<HTMLElement, ElasticScroll> = new Map();  // 存储所有实例
    private static observer: MutationObserver | null = null;                // DOM观察器
    private static options: Required<ElasticBounceOptions>;                 // 全局配置
    private static isSupported: boolean = false;                           // 浏览器支持状态

    // 默认配置
    private static defaults: Required<ElasticBounceOptions> = {
        container: '.elastic-container',  // 默认容器选择器
        excludeSelectors: [],            // 默认排除选择器列表
        maxStretch: 0.15,               // 最大拉伸比例
        resistance: 0.3,                // 拉伸阻力
        animationDuration: 300,         // 动画持续时间
        animationFunction: 'ease-out',  // 动画函数
        touchThreshold: 5               // 触摸阈值
    };

    /**
     * 检查浏览器是否支持必要的特性
     */
    private static checkSupport(): boolean {
        return !!(
            window.MutationObserver &&           // 检查MutationObserver支持
            window.Map &&                        // 检查Map支持
            typeof document.querySelector === 'function' && // 检查querySelector支持
            document.documentElement.classList    // 检查classList支持
        );
    }

    /**
     * 初始化弹性滚动
     * @param options 配置选项
     */
    public static init(options: ElasticBounceOptions = {}): void {
        // 检查浏览器支持
        this.isSupported = this.checkSupport();
        if (!this.isSupported) {
            console.warn('ElasticBounce: 浏览器不支持必要的特性');
            return;
        }

        try {
            // 合并配置
            this.options = Object.assign({}, this.defaults, options) as Required<ElasticBounceOptions>;
            this._setupGlobalStyles();
            this._startObserving();
        } catch (error) {
            console.warn('ElasticBounce初始化失败:', error);
            this.isSupported = false;
        }
    }

    /**
     * 设置全局样式
     * 添加必要的CSS样式到页面
     */
    private static _setupGlobalStyles(): void {
        if (!this.isSupported) return;

        try {
            // 检查是否已存在样式
            if (!document.getElementById('elastic-bounce-styles')) {
                const style = document.createElement('style');
                style.id = 'elastic-bounce-styles';
                // 设置弹性滚动的基础样式
                style.textContent = `
                    .elastic-bounce-content {
                        transform-origin: top;
                        transition: transform ${this.options.animationDuration}ms ${this.options.animationFunction};
                        will-change: transform;
                        height: 100%;
                        -webkit-overflow-scrolling: touch;
                    }
                `;
                document.head.appendChild(style);
            }
        } catch (error) {
            console.warn('设置全局样式失败:', error);
        }
    }

    /**
     * 开始观察DOM变化
     * 用于自动处理动态添加的滚动容器
     */
    private static _startObserving(): void {
        if (!this.isSupported) return;

        try {
            // 清理现有观察器
            if (this.observer) {
                this.observer.disconnect();
            }

            // 创建新的观察器
            if (window.MutationObserver) {
                this.observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        // 处理新增节点
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                const element = node as HTMLElement;
                                // 检查新增元素是否是滚动容器
                                if (element.matches && element.matches(this.options.container)) {
                                    this._initContainer(element);
                                }
                                // 检查新增元素的子元素
                                const containers = element.querySelectorAll?.(this.options.container);
                                containers?.forEach(container => {
                                    this._initContainer(container as HTMLElement);
                                });
                            }
                        });

                        // 处理删除的节点
                        mutation.removedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                const element = node as HTMLElement;
                                // 清理被删除的容器
                                if (this.instances.has(element)) {
                                    this._destroyContainer(element);
                                }
                                // 清理被删除元素的子容器
                                if (element.querySelectorAll) {
                                    const containers = element.querySelectorAll(this.options.container);
                                    containers.forEach(container => {
                                        if (this.instances.has(container as HTMLElement)) {
                                            this._destroyContainer(container as HTMLElement);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });

                // 开始观察
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 初始化现有的容器
                document.querySelectorAll(this.options.container)?.forEach(container => {
                    this._initContainer(container as HTMLElement);
                });
            }
        } catch (error) {
            console.warn('启动DOM观察失败:', error);
            this.isSupported = false;
        }
    }

    /**
     * 初始化单个容器
     * @param container 要初始化的容器元素
     */
    private static _initContainer(container: HTMLElement): void {
        if (!this.isSupported) return;

        try {
            // 检查是否禁用了弹性效果
            if (container.getAttribute('data-elastic') === 'false') {
                return;
            }

            // 检查是否已经初始化
            if (this.instances.has(container)) {
                return;
            }

            // 创建新实例
            const instance = new ElasticScroll(container, this.options);
            this.instances.set(container, instance);
        } catch (error) {
            console.warn('初始化容器失败:', error);
        }
    }

    /**
     * 销毁容器实例
     * @param container 要销毁的容器元素
     */
    private static _destroyContainer(container: HTMLElement): void {
        if (!this.isSupported) return;

        try {
            const instance = this.instances.get(container);
            if (!instance) return;

            instance.destroy();
            this.instances.delete(container);
        } catch (error) {
            console.warn('销毁容器失败:', error);
        }
    }

    /**
     * 更新所有实例
     * 用于手动触发容器的检查和初始化
     */
    public static update(): void {
        if (!this.isSupported) return;

        try {
            document.querySelectorAll?.(this.options.container)?.forEach(container => {
                if (!this.instances.has(container as HTMLElement)) {
                    this._initContainer(container as HTMLElement);
                }
            });
        } catch (error) {
            console.warn('更新实例失败:', error);
        }
    }

    /**
     * 更新配置选项
     * @param newOptions 新的配置选项
     */
    public static updateOptions(newOptions: Partial<ElasticBounceOptions>): void {
        if (!this.isSupported) return;

        try {
            this.options = Object.assign({}, this.options, newOptions) as Required<ElasticBounceOptions>;
            this._setupGlobalStyles();
            this.update();
        } catch (error) {
            console.warn('更新配置失败:', error);
        }
    }

    /**
     * 销毁所有实例
     * 清理所有相关的资源和事件监听
     */
    public static destroy(): void {
        if (!this.isSupported) return;

        try {
            // 停止DOM观察
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            // 销毁所有实例
            this.instances.forEach((instance, container) => {
                this._destroyContainer(container);
            });

            this.instances.clear();

            // 移除全局样式
            const style = document.getElementById('elastic-bounce-styles');
            if (style) {
                style.remove();
            }
        } catch (error) {
            console.warn('销毁所有实例失败:', error);
        }
    }

    /**
     * 启用弹性效果
     * @param container 要启用弹性效果的容器
     */
    public static enableElastic(container: HTMLElement): void {
        if (!this.isSupported) return;

        try {
            container.removeAttribute('data-elastic');
            this._initContainer(container);
        } catch (error) {
            console.warn('启用弹性效果失败:', error);
        }
    }

    /**
     * 禁用弹性效果
     * @param container 要禁用弹性效果的容器
     */
    public static disableElastic(container: HTMLElement): void {
        if (!this.isSupported) return;

        try {
            container.setAttribute('data-elastic', 'false');
            if (this.instances.has(container)) {
                this._destroyContainer(container);
            }
        } catch (error) {
            console.warn('禁用弹性效果失败:', error);
        }
    }
} 