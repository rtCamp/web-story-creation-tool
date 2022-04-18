/**
 * External dependencies
 */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

process.env.APP_ENV = process.env.APP_ENV || "";
const isGhPages = process.env.APP_ENV === "ghpages";
module.exports = {
  mode,
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          require.resolve("thread-loader"),
          {
            loader: require.resolve("babel-loader"),
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
            loader: "@svgr/webpack",
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
          "url-loader",
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
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
          "url-loader",
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        sideEffects: true,
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "../images",
            },
          },
        ],
      },
    ],
  },
  output: {
    publicPath: isGhPages ? "/web-story-creation-tool/" : "/",
    path: path.resolve(__dirname, "./build/playground"),
    filename: "js/[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: `./public/favicon.ico`,
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new WebpackBar({
      name: "Playground",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/preview.html",
          to: "",
        },
        {
          from: "./public/favicon.ico",
          to: "",
        },
        {
          from: "./public/manifest.json",
          to: "",
        },
        {
          from: "./public/images",
          to: "./images",
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
    use: ["source-map-loader"],
    enforce: "pre",
  });

  module.exports.plugins.push(
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: "./packages/playground-story-editor/src/src-sw.js",
      swDest: "sw.js",
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // main.js is 4.2 mb, and would be ignored.
    })
  );
}
