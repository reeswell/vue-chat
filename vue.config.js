// vue.config.js
module.exports = {
  publicPath: './',
  lintOnSave: false,

  configureWebpack: {
    devtool: 'cheap-module-eval-source-map'
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,

    proxy: {
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true
      // },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/sockjs-node': {
        target: 'http://localhost:3000',
        ws: false,
        changeOrigin: true
      }
    },
    open: true, // 自动打开浏览器
    // host: '0.0.0.0', // 允许外部ip访问
    overlay: {
      warnings: true,
      errors: true
    } // 错误、警告在页面弹出
  }
}
