const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public")
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets/', to: 'img/' },
    ]),
    new CleanWebpackPlugin(["public"]),
    new HtmlWebpackPlugin({
      title: "Scavenger",
      template: "index.html"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
