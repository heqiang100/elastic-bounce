# ElasticBounce.js 生成提示词

以下是生成 ElasticBounce.js SDK 的关键提示词集合。

## 基础需求描述

我需要一个移动端的弹性滚动效果 SDK，具有以下特点：
1. 支持容器内部有 header、content、footer 的布局
2. content 区域可以独立滚动
3. 只有当 content 滚动到边界，且继续拖动时才触发整体的弹性效果
4. 支持动态创建的容器
5. 需要自动检测可滚动元素

## 核心功能提示词

1. 容器结构检测：
   - 检测容器内部是否存在 header、content、footer 结构
   - 自动识别可滚动元素

2. 弹性效果实现：
   - 当 content 滚动到边界时，触发弹性效果
   - 弹性效果需要考虑 header 和 footer 的影响
   - 弹性效果需要考虑嵌套滚动的情况

3. 动态创建容器：
   - 支持动态创建容器
   - 支持动态创建 header、content、footer

4. 自动检测可滚动元素：
   - 自动检测容器内部的滚动元素
   - 自动检测嵌套滚动的情况

# Elastic Bounce 功能提示

## 基本功能

1. **弹性滚动效果**
```javascript
// 初始化弹性滚动
ElasticBounce.init({
  container: '.scroll-container',  // 滚动容器选择器
  maxStretch: 0.15,               // 最大拉伸比例
  resistance: 0.3                 // 拉伸阻力
});
```

2. **动态内容支持**
```javascript
// 自动处理动态添加的内容
const container = document.querySelector('.scroll-container');
container.appendChild(newContent);  // 无需手动更新
```

3. **嵌套滚动**
```html
<div class="elastic-container">
  <!-- 外层滚动区域 -->
  <div class="inner-scroll">
    <!-- 内层滚动区域 -->
  </div>
</div>
```

## 高级功能

1. **性能优化**
- RAF (RequestAnimationFrame) 动画优化
- 事件节流和防抖处理
- will-change 优化
- 自动清理资源

2. **特性检测**
```javascript
// 自动检测浏览器支持情况
- 触摸事件支持
- classList 支持
- transform 支持
- MutationObserver 支持
- RequestAnimationFrame 支持
```

3. **错误处理**
```javascript
try {
  ElasticBounce.init();
} catch (error) {
  console.warn('初始化失败:', error);
  // 自动降级为原生滚动
}
```

## 配置选项

```typescript
interface ElasticBounceOptions {
  container?: string;           // 容器选择器
  maxStretch?: number;         // 最大拉伸比例 (0-1)
  resistance?: number;         // 拉伸阻力 (0-1)
  animationDuration?: number;  // 动画时长 (ms)
  animationFunction?: string;  // 动画函数
  touchThreshold?: number;     // 触摸阈值 (px)
  excludeSelectors?: string[]; // 排除元素
}
```

## 常用场景

1. **下拉刷新**
```javascript
ElasticBounce.init({
  container: '.refresh-container',
  maxStretch: 0.3,  // 增大拉伸范围
  resistance: 0.4   // 增加阻力
});
```

2. **图片预览**
```javascript
ElasticBounce.init({
  container: '.image-viewer',
  maxStretch: 0.1,   // 减小拉伸范围
  resistance: 0.5    // 增加阻力
});
```

3. **长列表滚动**
```javascript
ElasticBounce.init({
  container: '.list-container',
  maxStretch: 0.15,
  animationDuration: 200  // 加快回弹速度
});
```

## 最佳实践

1. **HTML结构**
```html
<div class="page-container">
  <header>...</header>
  <div class="elastic-container">
    <div class="content">
      <!-- 滚动内容 -->
    </div>
  </div>
  <footer>...</footer>
</div>
```

2. **CSS设置**
```css
.elastic-container {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.content {
  min-height: 100%;
  padding: 20px;
}
```

3. **性能优化**
```javascript
// 使用节流控制滚动事件
ElasticBounce.init({
  container: '.scroll-container',
  touchThreshold: 5  // 增加触摸判定阈值
});
```

## 常见问题

1. **滚动不流畅**
- 检查是否启用了 `-webkit-overflow-scrolling: touch`
- 确保容器高度正确设置
- 避免过多的DOM元素

2. **嵌套滚动冲突**
- 使用 `excludeSelectors` 排除特定元素
- 确保内外层容器正确设置 overflow 属性

3. **动画卡顿**
- 减小 maxStretch 值
- 调整 animationDuration
- 使用 transform 代替位置属性

## 调试提示

1. **检查初始化**
```javascript
// 开发环境启用调试
ElasticBounce.init({
  debug: true  // 输出调试信息
});
```

2. **性能监控**
```javascript
// 监控关键指标
performance.mark('scroll-start');
// ... 滚动操作 ...
performance.mark('scroll-end');
performance.measure('scroll-time', 'scroll-start', 'scroll-end');
```

3. **错误排查**
- 检查浏览器控制台警告信息
- 验证DOM结构是否正确
- 确认样式设置是否合适



