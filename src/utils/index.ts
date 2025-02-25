/**
 * 节流函数
 * 限制函数在一定时间内只能执行一次
 * 常用于处理频繁触发的事件，如滚动、resize等
 * 
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒），默认16ms（约60fps）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 16
): (...args: Parameters<T>) => ReturnType<T> | void {
    let lastExecTime = 0;
    
    return function(this: any, ...args: Parameters<T>) {
        const now = Date.now();
        // 检查是否超过延迟时间
        if (now - lastExecTime >= delay) {
            fn.apply(this, args);
            lastExecTime = now;
        }
    };
}

/**
 * 防抖函数
 * 延迟函数的执行，直到一定时间内没有再次调用
 * 常用于处理输入、搜索等需要等待用户操作完成的场景
 * 
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒），默认16ms
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 16
): (...args: Parameters<T>) => void {
    let timer: number | null = null;
    
    return function(this: any, ...args: Parameters<T>) {
        // 清除之前的定时器
        if (timer) clearTimeout(timer);
        // 设置新的定时器
        timer = window.setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
} 