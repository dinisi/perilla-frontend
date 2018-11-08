const MonocoEditorPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  outputDir: undefined,
  baseUrl: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8680/"
      }
    }
  },

  configureWebpack: {
    plugins: [new MonocoEditorPlugin()]
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
