// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [
    new NodePolyfillPlugin({
      additionalAliases: ["process", "punycode"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  resolve: {
    conditionNames: ["browser", "require", "node"],
  },
  module: {
    rules: [
      {
        
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
