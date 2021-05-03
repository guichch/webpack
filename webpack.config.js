const path = require('path')

const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: {
      import: './src/main.js',
      dependOn: "shared"
    },
    another: {
      import: './src/another.js',
      dependOn: 'shared'
    },
    shared: 'lodash'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: './',
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset'
      }
    ]
  },

  plugins: [
    // new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      title: 'Development',
      template: './public/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],

  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },

  devServer: {
    contentBase: './dist',
    hot: true
  }
}