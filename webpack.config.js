var path = require("path");
var webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: "./frontend/chukachat.jsx",
  output: {
    path: path.join(__dirname, "frontend", "dist"),
    filename: "bundle.js"
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: [/\.js?$/,/\.jsx?$/]
    })],
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/env", "@babel/react"]
            
          },
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            outputPath: 'frontend/images/',
            publicPath: 'images/'
          }
        }]
      }
    ]
  },
  devtool: "source-maps",
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
