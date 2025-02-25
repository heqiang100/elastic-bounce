import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: "json" };

// 是否混淆代码（生产环境）
const isMinify = process.env.MINIFY === 'true';

// 生成文件名
const getFileName = (name, format) => {
  const suffix = `.${format}`;
  return `dist/${name}${suffix}${isMinify ? '.min' : ''}.js`;
};

// 生成 banner 信息
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} xhq
 * 一个轻量级的移动端弹性滚动效果库
 * Released under the MIT License.
 * @see https://github.com/heqiang100/elastic-bounce
 * Date: ${new Date().toISOString().split('T')[0]}
 */
`;

export default {
  input: 'src/index.ts',  // 入口文件
  output: [
    // CommonJS 格式
    {
      file: getFileName('elastic-bounce', 'cjs'),
      format: 'cjs',
      sourcemap: !isMinify,  // 仅在开发环境生成 sourcemap
      exports: 'auto',
      banner
    },
    // ES Module 格式
    {
      file: getFileName('elastic-bounce', 'esm'),
      format: 'es',
      sourcemap: !isMinify,  // 仅在开发环境生成 sourcemap
      banner
    },
    // UMD 格式 (用于浏览器)
    {
      file: getFileName('elastic-bounce', 'umd'),
      format: 'umd',
      name: 'ElasticBounce',
      sourcemap: !isMinify,  // 仅在开发环境生成 sourcemap
      exports: 'auto',
      banner
    }
  ],
  plugins: [
    // 处理 JSON 文件
    json(),
    // 解析第三方依赖
    resolve(),
    // 转换 CommonJS 模块
    commonjs(),
    // TypeScript 支持
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
      sourceMap: !isMinify  // TypeScript 的 sourceMap 也要关闭
    }),
    // Babel 转换
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    // 代码混淆（仅在 MINIFY 为 true 时启用）
    isMinify && terser({
      format: {
        comments: /^!/  // 保留以 ! 开头的注释（banner）
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ].filter(Boolean)
}; 