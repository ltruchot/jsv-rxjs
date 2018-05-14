const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack');
module.exports = {
  entry: './src/app.ts',  
  output: {
    filename: 'app.js'
  },
  mode: 'development',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 4200
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HotModuleReplacementPlugin()
  ]
};