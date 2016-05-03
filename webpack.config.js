'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: "eval-source-map",
	entry: {
    index: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/main.js')
    ],
    admin: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/admin.js')
    ]
  },
	output: {
		path: path.join(__dirname, "/dist/"),
		filename: "[name].js",
		publicPath: '/'
	},
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: 'app/admin.tpl.html',
      inject: 'body',
      filename: 'admin.html',
      chunks: ['admin']
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
	module: {
		loaders: [
		{
			test: /\.jsx?$/,
			loader: "babel",
			exclude: /node_modules/,
      query: {
        "presets": ["react", "es2015", "stage-0", "react-hmre"]
      }
		},
    {
      test: /\.json?$/,
      loader: 'json'
    },
		{
			test: /\.css$/,
			loader: "style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]"
		}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
