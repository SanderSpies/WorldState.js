'use strict';

var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
    publicPath: __dirname + '/build/'
  },
  resolve: {
    alias: {
      'worldstate$': require.resolve('../../lib/')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        //NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};
