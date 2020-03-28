const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|html|obj|mtl)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.css$$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Cow Farm',
      favicon: 'favicon.ico'
    })
  ],
}
