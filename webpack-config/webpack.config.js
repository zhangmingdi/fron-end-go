const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入html模板插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入clean-webpack-plugin插件
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.work\.(js|ts)$/,
        use: [{ loader: 'worker-loader' },
          {
            loader: 'babel-loader?cacheDirectory=true'
          }
        ],
        include: path.resolve('src')
      },
      {
        test: /\.(js|ts)x?$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.resolve('src')
      },

      { // 此处再添加一条rules，用于配置css预处理器信息
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]-[hash:base64:5]'
              }
            }
          },
          { // 添加这段配置信息即可
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'less-loader'
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                './src/global-less/global.less'
              ]
            }
          }
        ]
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: { // resolve核心配置
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve('src'),
      'custom-lib': path.resolve('custom-lib')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ // 实例化Html模板模块
      template: path.resolve('index.html')
    }),
    new CleanWebpackPlugin(), // 实例化clean-webpack-plugin插件
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('development'),
          BASE_URI: JSON.stringify(process.env.BASE_URI || '/api'),
          CSS_MODULE: true,
          LOCALE: JSON.stringify('zh-CN')
        }
      }
    })
  ],
  devServer: { // 配置热更新模块
    hot: true,
    open: true,
    port: 3500,
    static: '../dist'
  }
}
