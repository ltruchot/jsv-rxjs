const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const jsonServer = require('json-server');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app.ts',  
  output: {
    filename: 'app.js'
  },
  mode: 'development',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 4200,
    before: function(app) {
      app.use('/api', jsonServer.router('./api/db.json'));
    }
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
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['css/bootstrap.min.css'], append: true 
    }),
    new CopyWebpackPlugin([{ from: './src/assets', to: 'assets' }, { from: './node_modules/bootstrap/dist/css', to: 'css'},]),
    new HotModuleReplacementPlugin()
  ]
};