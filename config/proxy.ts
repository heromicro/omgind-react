export default {
  dev: {
    '/api/': {
      target: 'http://0.0.0.0:10088/',
      changeOrigin: true,
    },
  },
};
