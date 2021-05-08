const path = require('path');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    dapp: './src/dapp.ts',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // This will apply the loader before the other ones
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  optimization: {
      splitChunks: {
        chunks: 'async',
        minChunks: 1,
        cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "initial",
            },
            stlyes: {
              test: /\.css$/,
              name: "styles",
              chunks: "initial"
            }
        },
      }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
};
