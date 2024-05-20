const path = require('path');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/card.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'card.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  // externals: [nodeExternals()],
  // optimization: {
  //   usedExports: true,
  // },
};
