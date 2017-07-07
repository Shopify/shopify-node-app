const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

module.exports = {
  target: "web",
  devtool: "eval",
  entry: {
    main: [
      "@shopify/polaris/styles.css",
      "webpack-hot-middleware/client",
      path.resolve(__dirname, "app/index.js")
    ]
  },
  output: {
    filename: "[name].js",
    publicPath: "/assets/",
    libraryTarget: "var"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            query: {
              sourceMap: false,
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]-[local]_[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => autoprefixer(),
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: /@shopify\/polaris/,
        loaders: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            query: {
              sourceMap: false,
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]"
            }
          }
        ]
      }
    ]
  }
};
