import { defineConfig } from '@umijs/max';
import pageRoutes from './router.config';

export default defineConfig({
  title: 'OMGIND',
  antd: {},
  dva: {},
  locale: { default: 'zh-CN', antd: true, baseNavigator: false },
  routes: pageRoutes,
  hash: true,
  esbuildMinifyIIFE: true,
  fastRefresh: true,
  mfsu: false,
  theme: { 'primary-color': '#1890ff', ...require('@ant-design/antd-theme-variable') },
  proxy: {
    '/api/': { target: 'http://127.0.0.1:10088/', changeOrigin: true },
  },
});
