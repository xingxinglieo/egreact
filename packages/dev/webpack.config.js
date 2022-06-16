const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".ts", ".js", ".tsx", "jsx", ".mjs", ".json"],
    // 去那些目录搜索
    modules: ["src", "node_modules"],
    // 优先采用es6语法的第三方模块
    mainFields: ["jsnext:main", "module", "main"],
    // 别名
    alias: {
      "@": "./src"
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: [/node_modules/, /resource/, /typings/]
      }
    ]
  },
  devServer: {
    static: "./",
    open: true, // 启动时自动打开服务器
    hot: true, // 热启动
    host: "localhost", // 默认localhost
    port: 3333 // 默认端口 3000
  },
  plugins: [
    new DefinePlugin({
      __DEV__: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
