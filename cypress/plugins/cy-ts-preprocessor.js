const wp = require('@cypress/webpack-preprocessor')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackOptions = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsConfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
}

const options = {
  webpackOptions
}

module.exports = wp(options)