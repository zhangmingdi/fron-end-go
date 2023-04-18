module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    jsx: true
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'react/display-name': [0, { ignoreTranspilerName: false }],
    'react/jsx-indent': [2, 2]
  }
}
