const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pages = require('./pages.config')

const htmlPlugins = pages.map((page) => {
  return new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', `${page.template}`),
    filename: page.filename,
  })
})

module.exports = (_, argv) => {
  return {
    entry: path.join(__dirname, 'src', 'index.js'),
    devtool: argv.mode === 'development' ? 'source-map' : false,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.[contenthash].js',
      assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
    },
    plugins: [
      ...htmlPlugins,

      new FileManagerPlugin({
        events: {
          onStart: {
            delete: ['dist'],
          },
          onEnd: {
            copy: [
              {
                source: path.join('src', 'static'),
                destination: 'dist',
              },
            ],
          },
        },
      }),

      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    devServer: {
      watchFiles: path.join(__dirname, 'src'),
      port: 3000,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: [
            'html-loader',
            {
              loader: 'posthtml-loader',
              options: {
                plugins: [
                  require('posthtml-include')({
                    root: path.resolve(__dirname, 'src'),
                  }),
                ],
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: path.join('icons', '[name].[contenthash][ext]'),
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      minimizer: [
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                ['svgo', { name: 'preset-default' }],
              ],
            },
          },
        }),
      ],
    },
  }
}
