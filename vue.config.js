const MonocoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  outputDir: undefined,
  baseUrl: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: false,
  css: undefined,

  devServer: {
    proxy: {
      '/api': {
        target: process.env.TARGET || 'http://localhost:8680/'
      },
      '/auth': {
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
            loader: 'worker-loader',
            options: { inline: true }
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

  lintOnSave: undefined,

  pwa: {
    name: 'Perilla',
    themeColor: '#4A4A4A',
    msTileColor: '#4A90E2'
  }
}
