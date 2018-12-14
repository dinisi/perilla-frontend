module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'handle-callback-err': 'off',
    'new-cap': 'off',
    'no-useless-constructor': 'off',
    'no-callback-literal': 'off'
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}
