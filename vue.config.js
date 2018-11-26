const MonocoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  outputDir: undefined,
  baseUrl: '/frontend',
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: false,
  css: undefined,

  devServer: {
    proxy: {
      '/api': {
        target: process.env.TARGET || 'http://localhost:8680/'
      }
    }
  },

  configureWebpack: {
    plugins: [new MonocoEditorPlugin()],
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader'
          }
        }
      ]
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  lintOnSave: undefined
}
