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
      '/api': {
        target: 'http://localhost:3000/'
      }
    }
  }
}