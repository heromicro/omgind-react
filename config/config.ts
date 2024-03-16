// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import { theme } from 'antd';
import pageRoutes from './router.config';

const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm(defaultSeed);

const themevars = require('@ant-design/antd-theme-variable');

export default defineConfig({
  // add for transfer to umi
  antd: {},
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
  },
  fastRefresh: true,

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

  lessLoader: {
    modifyVars: mapToken,
  },
});
