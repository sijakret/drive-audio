const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const {EnvironmentPlugin, DefinePlugin} = require('webpack');

const outDir = process.env.NEXT ?
  'next/' : '';

const publicPath = '/drive-audio/' + outDir;

const config = {
  devtool: 'source-map',
  entry: {
    doc: './doc/index.js',
    'drive-audio': 'drive-audio'
  },
  output: {
    path: path.resolve(__dirname, 'dist-app', outDir),
    publicPath,
    filename: '[name].js'
  },
  devServer: {
    historyApiFallback: {
      index: publicPath,
      disableDotRule: true
    },
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
    crypto: 'empty',
    net: 'empty',
    tls: 'empty',
    http2: 'empty'
  },
  resolve: {
    alias: {
      'drive-audio': path.resolve(__dirname,'src')
    },
    extensions: [ '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: './doc/loaders/svg-loader'
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json')
            }
          }
        ],
        exclude: /node_modules/,
      },
      // {
      //   test: /lit\.s[ac]ss$/i,
      //   use: [
      //     path.resolve(__dirname, './doc/loaders/lit-loader'),
      //     /*{ 
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: () => [require('autoprefixer')]
      //       }
      //     },*/
      //     'sass-loader',
      //   ],
      // },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
        ],
      }
    ],
  },

  plugins: [
    new EnvironmentPlugin(['NEXT','DEBUG']),
    new DefinePlugin({
      'PUBLIC_PATH': JSON.stringify(publicPath)
    }),
    new HtmlWebpackPlugin({
      template: 'doc/index.html',
      chunks: ['doc'],
      inject: true
    }),
    new CopyPlugin([
      {
        from: 'doc/assets',
        to: 'assets'
      },
    ]),
    new FaviconsWebpackPlugin(
      path.join(__dirname, 'doc/assets/favicon.svg')
    )
  ]
};

module.exports = config