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
      { from: "assets/images/", to: "img/" },
      { from: "assets/sounds/", to: "sounds/" }
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
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      { test: /\.png(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
      { test: /\.css$/i, loaders: ["style-loader", "css-loader"] }
    ]
  }
};

module.exports = config;
