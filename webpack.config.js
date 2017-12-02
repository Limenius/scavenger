const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public")
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new CleanWebpackPlugin(["public"]),
    new HtmlWebpackPlugin({
      title: "Scavenger"
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
