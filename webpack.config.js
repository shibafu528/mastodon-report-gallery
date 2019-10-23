const path = require('path');

module.exports = {
  entry: './js/index.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: [
          'babel-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
