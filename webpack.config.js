module.exports = {
  entry: './src/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
    ],
    rules: [{
      test: /\.css$/,
      loader: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader'
    }, {
      test: /\.(ttf|eot|woff|woff2)$/,
      loader: "file-loader",
      options: {
        name: "fonts/[name].[ext]",
      },
    }],
  },
};
