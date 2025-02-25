/**
 * 节流函数
 * 限制函数在一定时间内只能执行一次
 * 常用于处理频繁触发的事件，如滚动、resize等
 *
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒），默认16ms（约60fps）
 * @returns 节流后的函数
 */
export declare function throttle<T extends (...args: any[]) => any>(fn: T, delay?: number): (...args: Parameters<T>) => ReturnType<T> | void;
/**
 * 防抖函数
 * 延迟函数的执行，直到一定时间内没有再次调用
 * 常用于处理输入、搜索等需要等待用户操作完成的场景
 *
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒），默认16ms
 * @returns 防抖后的函数
 */
export declare function debounce<T extends (...args: any[]) => any>(fn: T, delay?: number): (...args: Parameters<T>) => void;
