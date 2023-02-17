// https://umijs.org/config/
import { theme } from 'antd';
import pageRoutes from './router.config';

const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm(defaultSeed);

const themevars = require('@ant-design/antd-theme-variable');

export default {
  // add for transfer to umi
  antd: {},
  dva: {
    hmr: true,
  },
  targets: {
    ie: 11,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
  },
  dynamicImport: false,
  // 路由配置
  routes: pageRoutes,
  hash: true,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': '#1890ff',
    ...themevars,
  },
  proxy: {
    '/api/': {
      target: 'http://0.0.0.0:10088/',
      changeOrigin: true,
    },
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  mfsu: {},
  lessLoader: {
    modifyVars: mapToken,
  },
};
