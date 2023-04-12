const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  target: 'node',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  resolve: {
    extensions: ['.js'],
    modules: [resolve(__dirname, 'util'), resolve(__dirname, 'functions'), 'node_modules'],
    fallback: {
      path: false,
      os: false,
      child_process: false,
      fs: false,
      util: false,
      assert: false,
      constants: false,
      crypto: false,
      readline: false
    }
  },
};
