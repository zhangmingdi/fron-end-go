const babelConfig = {
  presets: [
    ['@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 2
      }],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ],
    '@babel/typescript'
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-transform-runtime']
}

module.exports = babelConfig
