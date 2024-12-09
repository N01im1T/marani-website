const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  };

  if (isProd) {
    config.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ];
  }

  return config;
};

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/main.js'),
    index: path.resolve(__dirname, './src/index.js'),
    checkout: path.resolve(__dirname, './src/checkout.js'),
    posters: path.resolve(__dirname, './src/posters.js'),
    poster: path.resolve(__dirname, './src/poster.js'),
  },
  output: {
    filename: `src/js/${filename("js")}`,
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico|webmanifest)$/,
        type: "asset/resource",
        generator: {
          filename: (pathData) => {
            const ext = path.extname(pathData.filename).replace(".", "");
            return `public/assets/[name].[contenthash].${ext}`;
          }
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true },
              optipng: { enabled: true },
              pngquant: { quality: [0.65, 0.90], speed: 4 },
              gifsicle: { interlaced: false },
              webp: { quality: 75 }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?)$/,
        type: "asset/resource",
        generator: {
          filename: (pathData) => {
            const ext = path.extname(pathData.filename).replace(".", "");
            return `public/assets/fonts/[name].[contenthash].${ext}`;
          }
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `src/css/${filename("css")}`,
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/index.html`,
      template: path.resolve(__dirname, `./public/html/index.html`),
      chunks: ['main', 'index'],
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/about.html`,
      template: path.resolve(__dirname, `./public/html/about.html`),
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/delivery.html`,
      template: path.resolve(__dirname, `./public/html/delivery.html`),
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/posters.html`,
      template: path.resolve(__dirname, `./public/html/posters.html`),
      chunks: ['main', 'posters'],
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/checkout.html`,
      template: path.resolve(__dirname, `./public/html/checkout.html`),
      chunks: ['main', 'checkout'],
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HtmlWebpackPlugin({
      filename: `public/html/poster.html`,
      template: path.resolve(__dirname, `./public/html/poster.html`),
      chunks: ['main', 'poster'],
      minify: {
        collapseWhitespace: isProd,
      },
    }),
  ],
};
