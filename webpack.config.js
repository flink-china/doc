const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = (mode) => {
  return {
    context: __dirname,

    entry: {
      main   : "./src/main.ts",
      doc    : "./src/doc.ts",
      default: "./src/default.ts",
      community: "./src/community.ts",
    },

    output: {
      filename     : "[name].[hash].js",
      chunkFilename: "[name].[chunkhash].chunk.js",
      pathinfo     : true
    },

    target: "web",

    mode: mode,

    resolve: {
      extensions: [".js", ".ts"]
    },

    module: {
      rules: [
        {
          enforce: "pre",
          test   : /\.js$/,
          loader : "source-map-loader"
        }, {
          enforce: "pre",
          test   : /\.ts$/,
          exclude: /node_modules/,
          loader : "tslint-loader"
        }, {
          test  : /\.ts$/,
          loader: "ts-loader"
        },
        {
          test: /\.(le|c)ss$/,
          use : [
            mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader : "postcss-loader",
              options: {
                plugins: () => autoprefixer({
                  browsers: ["last 3 versions", "> 1%"]
                })
              }
            },
            {
              loader : "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename : "[name].[hash].css",
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        chunks  : ["main"],
        filename: "index.html",
        template: "./src/index.html"
      }),
      new HtmlWebpackPlugin({
        chunks  : ["main"],
        filename: "index-en.html",
        template: "./src/index-en.html"
      }),
      new HtmlWebpackPlugin({
        chunks  : ["doc"],
        filename: "doc.html",
        template: "./src/doc.html"
      }),
      new HtmlWebpackPlugin({
        chunks  : ["default"],
        filename: "blog.html",
        template: "./src/blog.html"
      }),
      new HtmlWebpackPlugin({
        chunks  : ["community"],
        filename: "community.html",
        template: "./src/community.html"
      }),
      new CopyWebpackPlugin(
        [
          {
            "to"  : "assets",
            "from": "./src/assets"
          },
          {
            "to"  : "assets",
            "from": "./markdown/doc/assets"
          }
        ]
      )
    ]
  };
};

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  if (mode === "production") {
    const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
    return merge(config(mode), {
      optimization: {
        minimize : true,
        minimizer: [
          new UglifyJsPlugin({
            parallel: require("os").cpus().length,

            uglifyOptions: {
              ie8: false,

              output: {
                ecma    : 8,
                beautify: false,
                comments: false
              }
            }
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      }
    });
  } else {
    return merge(config(mode), {
      devServer: {
        port              : 4200,
        open              : true,
        watchContentBase  : true,
        historyApiFallback: true
      }
    });
  }

};

