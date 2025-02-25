# Elastic Bounce

一个轻量级的移动端弹性滚动效果库，一次性为您的应用所有页面添加平滑的弹性滚动体验。

## 特性

- 🎯 零依赖，轻量级
- 🚀 高性能，使用 RAF 优化
- 📱 专为移动端优化
- 🔄 支持容器内部滚动
- 🎨 可自定义动画效果
- 💪 TypeScript 支持
- ⚡️ 支持渐进式增强

## 效果

![效果](https://i.ibb.co/cKJsSnrq/chrome-capture-2025-2-25.gif)

## 安装

```bash
# 使用 npm
npm install elastic-bounce

# 使用 yarn
yarn add elastic-bounce

# 使用 pnpm
pnpm add elastic-bounce
```

## 使用方式

### 在浏览器中使用

```html
<script src="path/to/elastic-bounce.umd.js"></script>
<script>
  // 初始化弹性滚动
  ElasticBounce.init({
    container: '.scroll-container',
    maxStretch: 0.15,    // 最大拉伸比例
    resistance: 0.3,     // 拉伸阻力
    animationDuration: 300,  // 动画持续时间（毫秒）
    animationFunction: 'ease-out',  // 动画函数
    excludeSelectors: ['.no-elastic']  // 排除的元素选择器
  });
</script>
```

### 在模块系统中使用

```javascript
// 导入全部功能
import ElasticBounce from 'elastic-bounce';

// 或者按需导入
import { init, destroy, enableElastic, disableElastic } from 'elastic-bounce';

// 初始化
ElasticBounce.init({
  container: '.scroll-container',
  maxStretch: 0.15
});

// 或者使用按需导入的方式
init({
  container: '.scroll-container',
  maxStretch: 0.15
});
```

## API

### 配置选项

```typescript
interface ElasticBounceOptions {
  container?: string;           // 容器选择器
  maxStretch?: number;         // 最大拉伸比例，默认 0.15
  resistance?: number;         // 拉伸阻力，默认 0.3
  animationDuration?: number;  // 动画持续时间（毫秒），默认 300
  animationFunction?: string;  // 动画函数，默认 'ease-out'
  excludeSelectors?: string[]; // 排除的元素选择器列表
}
```

### 方法

```javascript
// 初始化弹性滚动
ElasticBounce.init(options);

// 更新所有实例
ElasticBounce.update();

// 更新配置
ElasticBounce.updateOptions(newOptions);

// 销毁所有实例
ElasticBounce.destroy();

// 启用弹性效果
ElasticBounce.enableElastic(element);

// 禁用弹性效果
ElasticBounce.disableElastic(element);
```

## 高级用法

### 动态内容

自动处理动态添加的内容：

```javascript
// 添加新内容后无需手动更新
const container = document.querySelector('.scroll-container');
container.appendChild(newContent);

// 如果添加了新的滚动容器，可以手动更新
ElasticBounce.update();
```

### 禁用特定元素

可以通过添加选择器来排除特定元素：

```javascript
ElasticBounce.init({
  container: '.scroll-container',
  excludeSelectors: [
    '.no-elastic',     // 类选择器
    '#fixed-element',  // ID 选择器
    '[data-fixed]'     // 属性选择器
  ]
});
```

## 浏览器支持

- 支持所有现代浏览器
- 自动检测特性支持并优雅降级
- 在不支持的浏览器中会保持原生滚动行为

## 许可证

MIT