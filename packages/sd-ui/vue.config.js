const path = require('path')
const resolve = (folder) => path.resolve(__dirname, folder)

const NODE_ENV = process.env.NODE_ENV

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

const vueConfig = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },

  // 配置全局
  css: {
    loaderOptions: {
      scss: {
        data: `
          @import "./theme/global-default.scss";
          @import "./assets/sass/theme/theme.scss";
        `
      }
    }
  },

  chainWebpack: (config) => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('examples'))
      .set('assets', resolve('@/assets'))
      .set('packages', resolve('./packages'))
  }
}

module.exports = vueConfig
