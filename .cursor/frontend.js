module.exports = {
  // Vue 相关配置
  vue: {
    template: {
      // 缩进配置
      indent: 2,
      
      // 每个元素属性最大数量
      maxAttrs: 3,
      
      // 属性顺序，按优先级排序
      attrOrder: [
        'v-if',    // 条件渲染最优先
        'v-for',   // 列表渲染次之
        'v-model', // 双向绑定
        'ref',     // 引用
        'key',     // key值
        ':prop',   // 动态属性
        '@event'   // 事件处理
      ],
      
      // 单行元素的规则
      singleline: {
        maxLength: 80,  // 单行最大长度
        maxAttrs: 1     // 单行最多属性数
      }
    },
    
    script: {
      // 组件选项的顺序规范
      orderInComponent: [
        'name',       // 组件名称
        'components', // 子组件
        'props',      // 属性定义
        'data',       // 数据
        'computed',   // 计算属性
        'watch',      // 监听器
        'methods',    // 方法
        'lifecycle'   // 生命周期钩子
      ]
    }
  },

  // HTML 规范
  html: {
    indent: 2,
    quotes: 'double', // HTML属性使用双引号
    
    // 自闭合标签的处理方式
    selfClosing: {
      style: 'always',
      tags: ['img', 'input', 'br', 'hr']
    }
  },

  // JavaScript 规范
  javascript: {
    // 基础配置
    basic: {
      indent: 2,
      quotes: 'single',
      semi: true
    },
    
    // 命名规范
    naming: {
      // 组件采用大驼峰命名
      components: {
        style: 'PascalCase',
        examples: ['UserProfile', 'TodoList']
      },
      
      // 变量采用小驼峰命名
      variables: {
        style: 'camelCase',
        examples: ['userData', 'isLoading']
      },
      
      // 常量使用大写下划线
      constants: {
        style: 'UPPER_CASE',
        examples: ['API_KEY', 'MAX_COUNT']
      }
    }
  },

  // CSS 规范
  css: {
    // 属性排序规则
    propertyOrder: [
      /* 定位属性 */
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      
      /* 盒模型 */
      'display',
      'flex',
      'width',
      'height',
      'margin',
      'padding',
      
      /* 文字样式 */
      'font',
      'color',
      'text-align',
      
      /* 视觉效果 */
      'background',
      'border',
      'opacity',
      
      /* 动画效果 */
      'transition',
      'animation'
    ],
    
    // BEM命名规范配置
    bem: {
      enabled: true,
      patterns: {
        block: '[a-z]+(?:-[a-z]+)*',
        element: '__[a-z]+(?:-[a-z]+)*',
        modifier: '--[a-z]+(?:-[a-z]+)*'
      },
      examples: {
        block: 'header',
        element: 'header__navigation',
        modifier: 'header__navigation--active'
      }
    }
  },

  // 忽略规则
  ignore: {
    // 忽略特定文件或目录
    paths: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.min.js'
    ],
    
    // 忽略特定规则
    rules: [
      'maxLines',
      'requireJsdoc'
    ]
  }
};