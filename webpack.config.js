'use strict';

let
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
      const
        BODY_PARSER = require('body-parser'),
        DB_ROUTE = __dirname + '/db';

      let
        _productsData = require(DB_ROUTE + '/products.json'),
        _traitsData = require(DB_ROUTE + '/traits.json');


      function _updateItem(id, body) {
        let
          data = Object.assign({id: parseInt(id)}, body),
          item = _productsData.data.find(item => item.id === data.id);

        item = Object.assign(item, data);
        console.log(item);
        _saveToFile('products');
      }

      function _saveToFile(file) {
        switch (file) {
          case 'products':
            fs.writeFile(DB_ROUTE + '/products.json', _productsData, 'utf-8');
            break;
          case 'traits':

            break;
        }
      }

      app.use(BODY_PARSER.json());
      app.use(BODY_PARSER.urlencoded({extended: true}));

      app
        .get('/api/products', (req, res) => {
          res.json(productsData);
        })
        .put('/api/products/:id', (req, res) => {
          _updateItem(req.params.id, req.body);
          res.send('success');
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
