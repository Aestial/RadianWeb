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
    loaders: [],
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader",
        options: {
          includePaths: ["absolute/path/a", "absolute/path/b"]
        }
      }]
    }, {
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
