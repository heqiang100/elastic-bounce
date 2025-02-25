import { ElasticScrollOptions } from './ElasticScroll';
/**
 * 弹性滚动工厂类的配置选项接口
 * 继承自ElasticScrollOptions并添加额外的配置项
 */
export interface ElasticBounceOptions extends ElasticScrollOptions {
    container?: string;
    excludeSelectors?: string[];
}
/**
 * 弹性滚动工厂类
 * 负责管理多个滚动容器的弹性效果
 */
export declare class ElasticBounce {
    private static instances;
    private static observer;
    private static options;
    private static isSupported;
    private static defaults;
    /**
     * 检查浏览器是否支持必要的特性
     */
    private static checkSupport;
    /**
     * 初始化弹性滚动
     * @param options 配置选项
     */
    static init(options?: ElasticBounceOptions): void;
    /**
     * 设置全局样式
     * 添加必要的CSS样式到页面
     */
    private static _setupGlobalStyles;
    /**
     * 开始观察DOM变化
     * 用于自动处理动态添加的滚动容器
     */
    private static _startObserving;
    /**
     * 初始化单个容器
     * @param container 要初始化的容器元素
     */
    private static _initContainer;
    /**
     * 销毁容器实例
     * @param container 要销毁的容器元素
     */
    private static _destroyContainer;
    /**
     * 更新所有实例
     * 用于手动触发容器的检查和初始化
     */
    static update(): void;
    /**
     * 更新配置选项
     * @param newOptions 新的配置选项
     */
    static updateOptions(newOptions: Partial<ElasticBounceOptions>): void;
    /**
     * 销毁所有实例
     * 清理所有相关的资源和事件监听
     */
    static destroy(): void;
    /**
     * 启用弹性效果
     * @param container 要启用弹性效果的容器
     */
    static enableElastic(container: HTMLElement): void;
    /**
     * 禁用弹性效果
     * @param container 要禁用弹性效果的容器
     */
    static disableElastic(container: HTMLElement): void;
}
