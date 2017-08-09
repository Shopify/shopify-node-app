const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const isDevelopment = process.env.NODE_ENV !== 'production';

const sourceMap = isDevelopment;
const plugins = isDevelopment
  ? [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]
  : [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
        minimize: true,
      }),
    ];

const extraEntryFiles = isDevelopment
  ? ['react-hot-loader/patch', 'webpack-hot-middleware/client']
  : [];

module.exports = {
  plugins,
  target: 'web',
  devtool: 'eval',
  entry: {
    main: [
      '@shopify/polaris/styles.css',
      path.resolve(__dirname, '../client/index.js'),
      ...extraEntryFiles,
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../assets'),
    publicPath: '/assets/',
    libraryTarget: 'var',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              sourceMap,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => autoprefixer(),
              sourceMap,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /@shopify\/polaris/,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              sourceMap,
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          },
        ],
      },
    ],
  },
};
