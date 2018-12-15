const MonocoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  outputDir: undefined,
  baseUrl: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: false,
  css: {
    extract: false
  },

  configureWebpack: {
    plugins: [new MonocoEditorPlugin()],
    module: {
      rules: [
        {
          test: /\.w\.js$/,
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
