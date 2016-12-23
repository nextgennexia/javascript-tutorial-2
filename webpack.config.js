'use strict';

const
  webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  fs = require('fs');

module.exports = {
  entry: [
    './app/application.js'
  ],
  output: {
    path: __dirname + '/public',
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    contentBase: './',
    port: 3333,
    setup: (app) => {
      const dbRoute = __dirname + '/db';
      app
        .get('/api/products', (req, res) => {
          res.sendFile(dbRoute + '/windowSill.json');
        });
    }
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass'])
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?presets[]=es2015'
      },
      {
        test: /\.hbs$/,
        exclude: /(node_modules)/,
        loader: 'handlebars-loader'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  },
  plugins: [
    new ExtractTextPlugin('package.css'),
    new webpack.HotModuleReplacementPlugin()
  ]
};
