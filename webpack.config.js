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
    extensions: ['.js', '.json'],
    modules: [resolve(__dirname, 'util'), resolve(__dirname, 'functions'), 'node_modules']
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
    '@primno/dpapi': 'commonjs @primno/dpapi',
    'node-hide-console-window': 'commonjs node-hide-console-window',
  }
};
