import { throttle, debounce } from '../utils';

/**
 * 弹性滚动的配置选项接口
 */
export interface ElasticScrollOptions {
  maxStretch?: number;      // 最大拉伸比例
  resistance?: number;      // 拉伸阻力
  animationDuration?: number; // 动画持续时间
  animationFunction?: string; // 动画函数
  touchThreshold?: number;  // 触摸判定阈值
  excludeSelectors?: string[];  // 排除的选择器列表
}

/**
 * 弹性滚动的核心实现类
 * 负责处理单个滚动容器的弹性效果
 */
export class ElasticScroll {
  // 私有属性定义
  private element: HTMLElement;                    // 当前处理的DOM元素
  private options: Required<ElasticScrollOptions>; // 合并后的完整配置项
  private startY: number = 0;                      // 触摸开始时的Y坐标
  private lastY: number = 0;                       // 上一次触摸的Y坐标
  private isTouching: boolean = false;             // 是否正在触摸
  private scrollElement: HTMLElement | null = null; // 实际的滚动元素
  private touchMoveTimer: number | null = null;    // 触摸移动的定时器
  private boundTouchStart: (e: TouchEvent) => void = () => {}; // 绑定的触摸开始事件
  private boundTouchMove: (e: TouchEvent) => void = () => {};  // 绑定的触摸移动事件
  private boundTouchEnd: () => void = () => {};                // 绑定的触摸结束事件
  private isSupported: boolean = false;            // 浏览器是否支持所需特性
  private animationFrameId: number | null = null;  // requestAnimationFrame的ID

  // 默认配置
  private static defaultOptions: Required<ElasticScrollOptions> = {
    maxStretch: 0.15,         // 默认最大拉伸比例为15%
    resistance: 0.3,          // 默认拉伸阻力为0.3
    animationDuration: 300,   // 默认动画持续时间300ms
    animationFunction: 'ease-out', // 默认动画函数
    touchThreshold: 5,        // 默认触摸判定阈值5px
    excludeSelectors: []      // 默认不排除任何元素
  };

  /**
   * 检查浏览器是否支持必要的特性
   * 包括触摸事件、classList、transform等现代浏览器特性
   */
  private static checkSupport(): boolean {
    return !!(
      'ontouchstart' in window &&                    // 检查触摸事件支持
      document.documentElement.classList &&           // 检查classList支持
      'transform' in document.documentElement.style && // 检查transform支持
      typeof window.getComputedStyle === 'function' && // 检查getComputedStyle支持
      window.requestAnimationFrame                    // 检查requestAnimationFrame支持
    );
  }

  /**
   * 构造函数
   * @param element 需要添加弹性效果的DOM元素
   * @param options 配置选项
   */
  constructor(element: HTMLElement, options: ElasticScrollOptions = {}) {
    this.element = element;
    this.options = { ...ElasticScroll.defaultOptions, ...options };
    
    // 检查浏览器支持
    this.isSupported = ElasticScroll.checkSupport();
    if (!this.isSupported) {
      return;
    }

    // 绑定事件处理函数并应用节流和防抖
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchMove = throttle(this.handleTouchMove.bind(this), 16); // 约60fps
    this.boundTouchEnd = debounce(this.handleTouchEnd.bind(this), 16);
    this.init();
  }

  /**
   * 初始化滚动容器
   * 设置必要的样式和事件监听
   */
  private init(): void {
    if (!this.isSupported) return;

    try {
      // 使用当前元素作为滚动容器
      this.scrollElement = this.element;

      // 检查容器是否可滚动
      const containerStyle = window.getComputedStyle(this.element);
      const isContainerScrollable = (
        (containerStyle.overflowY === 'auto' || containerStyle.overflowY === 'scroll') &&
        this.element.scrollHeight > this.element.clientHeight
      );

      // 如果容器不可滚动，添加必要的样式
      if (!isContainerScrollable) {
        this.element.style.overflowY = 'auto';
        (this.element.style as any)['-webkit-overflow-scrolling'] = 'touch'; // iOS流畅滚动
      }

      // 添加弹性效果的类名和绑定事件
      this.scrollElement.classList.add('elastic-bounce-content');
      this.bindEvents();
    } catch (error) {
      console.warn('ElasticBounce初始化失败:', error);
      this.isSupported = false;
    }
  }

  /**
   * 查找第一个可滚动的子元素
   * 递归遍历DOM树查找可滚动元素
   */
  private findScrollableElement(element: HTMLElement): HTMLElement | null {
    try {
      const style = window.getComputedStyle(element);
      const isScrollable = (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        element.scrollHeight > element.clientHeight
      );

      // 如果当前元素可滚动，直接返回
      if (isScrollable) {
        return element;
      }

      // 递归查找子元素
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i] as HTMLElement;
        const childStyle = window.getComputedStyle(child);
        const isChildScrollable = (
          (childStyle.overflowY === 'auto' || childStyle.overflowY === 'scroll') &&
          child.scrollHeight > child.clientHeight
        );

        if (isChildScrollable) {
          return child;
        }

        const result = this.findScrollableElement(child);
        if (result) {
          return result;
        }
      }
    } catch (error) {
      console.warn('查找可滚动元素失败:', error);
    }

    return null;
  }

  /**
   * 绑定触摸事件处理函数
   */
  private bindEvents(): void {
    if (!this.isSupported || !this.scrollElement) return;

    try {
      // 绑定各种触摸事件
      this.scrollElement.addEventListener('touchstart', this.boundTouchStart, { passive: true });
      this.scrollElement.addEventListener('touchmove', this.boundTouchMove, { passive: false });
      this.scrollElement.addEventListener('touchend', this.boundTouchEnd);
      this.scrollElement.addEventListener('touchcancel', this.boundTouchEnd);
    } catch (error) {
      console.warn('绑定事件失败:', error);
      this.isSupported = false;
    }
  }

  /**
   * 检查元素是否在排除列表中
   */
  private isExcluded(element: HTMLElement): boolean {
    try {
      return this.options.excludeSelectors.some(selector => {
        return element.matches(selector) || element.closest(selector) !== null;
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * 处理触摸开始事件
   * 记录初始触摸位置并重置样式
   */
  private handleTouchStart(e: TouchEvent): void {
    if (!this.isSupported || !this.scrollElement || this.isExcluded(e.target as HTMLElement)) {
      return;
    }

    try {
      // 记录触摸开始位置
      this.startY = this.lastY = e.touches[0].clientY;
      this.isTouching = true;

      // 重置变换样式
      this.scrollElement.style.transition = 'none';
      this.scrollElement.style.transform = 'none';
    } catch (error) {
      console.warn('处理触摸开始事件失败:', error);
    }
  }

  /**
   * 处理触摸移动事件
   * 计算并应用弹性效果
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!this.isSupported || !this.scrollElement || !this.isTouching || this.isExcluded(e.target as HTMLElement)) {
      return;
    }

    try {
      // 计算移动距离
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - this.lastY;
      const totalDelta = currentY - this.startY;
      
      // 获取滚动状态
      const scrollTop = this.scrollElement.scrollTop;
      const maxScroll = this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = Math.abs(scrollTop - maxScroll) < 1;

      // 处理嵌套滚动
      const isTargetChild = this.scrollElement.contains(e.target as Node);
      const targetScrollable = this.findScrollableParent(e.target as HTMLElement);

      // 处理子元素滚动
      if (isTargetChild && targetScrollable && targetScrollable !== this.scrollElement) {
        const targetScrollTop = targetScrollable.scrollTop;
        const targetMaxScroll = targetScrollable.scrollHeight - targetScrollable.clientHeight;
        const isTargetAtTop = targetScrollTop <= 0;
        const isTargetAtBottom = Math.abs(targetScrollTop - targetMaxScroll) < 1;

        if (!((isTargetAtTop && deltaY > 0) || (isTargetAtBottom && deltaY < 0))) {
          return;
        }
      }

      // 判断是否需要应用弹性效果
      const shouldApplyElastic = (isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0);

      if (shouldApplyElastic) {
        if (e.cancelable) {
          e.preventDefault();
        }

        // 使用RAF优化动画性能
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(() => {
          if (!this.scrollElement) return;

          // 计算弹性效果
          const stretch = totalDelta * this.options.resistance;
          const direction = totalDelta > 0 ? 1 : -1;
          const adjustedStretch = Math.pow(Math.abs(stretch), 0.8) * direction;
          
          // 计算缩放比例
          const scale = 1 + Math.min(
            Math.abs(adjustedStretch) / this.scrollElement.clientHeight, 
            this.options.maxStretch
          );
          
          // 应用变换效果
          this.scrollElement.style.transform = `scaleY(${scale})`;
          this.scrollElement.style.transformOrigin = totalDelta > 0 ? 'top' : 'bottom';
        });
      }

      this.lastY = currentY;
    } catch (error) {
      console.warn('处理触摸移动事件失败:', error);
    }
  }

  /**
   * 查找元素最近的可滚动父元素
   */
  private findScrollableParent(element: HTMLElement | null): HTMLElement | null {
    while (element && element !== document.body) {
      const style = window.getComputedStyle(element);
      const isScrollable = (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        element.scrollHeight > element.clientHeight
      );

      if (isScrollable) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  /**
   * 处理触摸结束事件
   * 恢复原始状态并播放恢复动画
   */
  private handleTouchEnd(): void {
    if (!this.isSupported || !this.scrollElement || !this.isTouching) return;
    
    try {
      this.isTouching = false;

      // 取消正在进行的动画
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // 使用RAF应用恢复动画
      requestAnimationFrame(() => {
        if (!this.scrollElement) return;

        // 设置过渡动画
        const duration = this.options.animationDuration;
        const timing = this.options.animationFunction;
        this.scrollElement.style.transition = `transform ${duration}ms ${timing}`;
        this.scrollElement.style.transform = 'none';

        // 动画结束后清理
        setTimeout(() => {
          if (!this.isTouching && this.scrollElement) {
            this.scrollElement.style.transition = 'none';
          }
        }, duration);
      });
    } catch (error) {
      console.warn('处理触摸结束事件失败:', error);
    }
  }

  /**
   * 更新配置选项
   */
  public updateOptions(newOptions: Partial<ElasticScrollOptions>): void {
    if (!this.isSupported) return;
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * 销毁实例
   * 清理所有事件监听和样式
   */
  public destroy(): void {
    if (!this.isSupported || !this.scrollElement) return;

    try {
      // 清理动画相关
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (this.touchMoveTimer) {
        clearTimeout(this.touchMoveTimer);
        this.touchMoveTimer = null;
      }

      // 移除事件监听
      this.scrollElement.removeEventListener('touchstart', this.boundTouchStart);
      this.scrollElement.removeEventListener('touchmove', this.boundTouchMove);
      this.scrollElement.removeEventListener('touchend', this.boundTouchEnd);
      this.scrollElement.removeEventListener('touchcancel', this.boundTouchEnd);
      
      // 清理样式
      this.scrollElement.classList.remove('elastic-bounce-content');
      this.scrollElement.style.transform = '';
      this.scrollElement.style.transformOrigin = '';
      this.scrollElement.style.transition = '';
      
      // 清理滚动样式
      if (this.scrollElement === this.element) {
        this.element.style.overflowY = '';
        (this.element.style as any)['-webkit-overflow-scrolling'] = '';
      }
    } catch (error) {
      console.warn('销毁实例失败:', error);
    }
  }
} 