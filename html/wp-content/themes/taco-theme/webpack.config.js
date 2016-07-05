'use strict';

let ExtractTextPlugin     = require('extract-text-webpack-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');
let webpack               = require('webpack');
let fs                    = require('fs');
let path                  = require('path')

let is_production = false;
process.argv.forEach(function(arg) {
  if (arg === '-p' || arg === '--production') {
    is_production = true;
  }
});

let source_path = './_/src/js/';
let output_path = './_/';

// Get all top level files
let files = fs.readdirSync(source_path);

let entry_points = {};
files.forEach(function(file) {
  let stat = fs.statSync(source_path + file);

  if (stat.isFile()) {
    let base_name = path.basename(file, path.extname(file));
    entry_points[base_name] = source_path + file;
  }
});

module.exports = {
  entry: entry_points,
  devtool: 'eval-source-map',
  output: {
      path: output_path + 'dist/',
      filename: '[name]' + (is_production === true ? '.min' : '') +  '.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.(jpg|png|svg|gif|eot|ttf|woff)(\?.+)?$/,
        loader: 'file-loader?name=assets/[name].[ext]'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]' + (is_production === true ? '.min' : '') +  '.css'),
    new WebpackNotifierPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': (is_production === true ? 'production' : 'development')
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  }
};