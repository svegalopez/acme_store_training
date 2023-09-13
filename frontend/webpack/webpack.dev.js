const Dotenv = require("dotenv-webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  cache: true,
  mode: "development",
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, "..", "env/.env.dev"),
    }),
    new HtmlWebpackPlugin({
      title: "ACME Pet Supplies | DEV",
      template: path.resolve(__dirname, "..", "./src/index.html"),
      publicPath: "/",
      favicon: path.resolve(__dirname, "..", "./src/assets/favicon.png"),
    }),
  ],
};
