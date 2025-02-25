module.exports = {
  // 核心框架
  framework: {
    name: "Vue",
    version: "3.x",
    composition: true, // 使用组合式 API
  },

  // UI 框架
  ui: {
    name: "null",
    // 使用原生 HTML 元素
    components: ["div", "input", "button", "select", "table"],
  }
};
