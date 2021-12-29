/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

process.env.APP_ENV = process.env.APP_ENV || '';
const isGhPages = process.env.APP_ENV === 'ghpages';
module.exports = {
  mode,
  entry: './packages/playground-story-editor/src/index.js',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              // Babel uses a directory within local node_modules
              // by default. Use the environment variable option
              // to enable more persistent caching.
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
            },
          },
        ],
      },
      // These should be sync'd with the config in `.storybook/main.cjs`.
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      currentColor: /^(?!url|none)/i,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      // See https://github.com/google/web-stories-wp/pull/6361
                      currentColor: false,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../images',
            },
          },
        ],
      },
    ],
  },
  output: {
    publicPath: isGhPages ? '/web-story-creation-tool/' : '/',
    path: path.resolve(__dirname, './build/playground'),
    filename: 'js/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './packages/playground-story-editor/public/index.html',
      favicon: `./packages/playground-story-editor/public/favicon.ico`,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new WebpackBar({
      name: 'Playground',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './packages/playground-story-editor/public/preview.html',
          to: '',
        },
        {
          from: './packages/playground-story-editor/public/favicon.ico',
          to: '',
        },
        {
          from: './packages/playground-story-editor/public/manifest.json',
          to: '',
        },
        {
          from: './packages/playground-story-editor/public/images',
          to: './images',
        },
      ],
    }),
  ],
  devServer: {
    compress: true,
    port: 8000,
  },
};

if (isProduction) {
  module.exports.module.rules.push({
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre',
  });

  module.exports.plugins.push(
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './packages/playground-story-editor/src/src-sw.js',
      swDest: 'sw.js',
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // main.js is 4.2 mb, and would be ignored.
    })
  );
}
