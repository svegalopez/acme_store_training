const Dotenv = require("dotenv-webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: () => true })],
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, "..", "env/.env.prod"),
    }),
    new HtmlWebpackPlugin({
      title: "ACME Pet Supplies",
      template: path.resolve(__dirname, "..", "./src/index.html"),
      publicPath: "/",
      favicon: path.resolve(__dirname, "..", "./src/assets/favicon.png"),
    }),
    new WebpackObfuscator({
      rotateStringArray: true,
    }),
  ],
};
