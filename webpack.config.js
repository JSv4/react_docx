// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'ooxmlRenderer.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ooxmlRenderer',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
};
