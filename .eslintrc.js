module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'handle-callback-err': 'off',
    'new-cap': 'off',
    'no-useless-constructor': 'off',
    'no-callback-literal': 'off'
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}
