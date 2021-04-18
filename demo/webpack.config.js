const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: './src/App.tsx',
  output: {
    filename: './App.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9009
  },
  devtool: "source-map",
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: [".ts", ".tsx", ".js", '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
};