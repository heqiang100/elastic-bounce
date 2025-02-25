import { ElasticBounce } from './core/ElasticBounce';

// // 创建浏览器全局对象
// const elasticBounce = {
//     init: ElasticBounce.init.bind(ElasticBounce),
//     update: ElasticBounce.update.bind(ElasticBounce),
//     updateOptions: ElasticBounce.updateOptions.bind(ElasticBounce),
//     destroy: ElasticBounce.destroy.bind(ElasticBounce),
//     enableElastic: ElasticBounce.enableElastic.bind(ElasticBounce),
//     disableElastic: ElasticBounce.disableElastic.bind(ElasticBounce)
// };

// // 导出类型
// export type { ElasticBounceOptions } from './core/ElasticBounce';
// export type { ElasticScrollOptions } from './core/ElasticScroll';

// // 导出全局对象
// export default elasticBounce;

// 导出所有静态方法
export const init = ElasticBounce.init.bind(ElasticBounce);
export const update = ElasticBounce.update.bind(ElasticBounce);
export const updateOptions = ElasticBounce.updateOptions.bind(ElasticBounce);
export const destroy = ElasticBounce.destroy.bind(ElasticBounce);
export const enableElastic = ElasticBounce.enableElastic.bind(ElasticBounce);
export const disableElastic = ElasticBounce.disableElastic.bind(ElasticBounce);

// 导出类型
export type { ElasticBounceOptions } from './core/ElasticBounce';
export type { ElasticScrollOptions } from './core/ElasticScroll';

// 导出默认对象
export default {
    init,
    update,
    updateOptions,
    destroy,
    enableElastic,
    disableElastic
}; 